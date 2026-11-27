
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/", limiter);

const codes = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function hashCode(email, code) {
  return crypto
    .createHmac("sha256", process.env.CODE_SECRET)
    .update(email.toLowerCase() + ":" + code)
    .digest("hex");
}

// Enviar un código propio de FB DISTRIBUCION.
app.post("/api/send-code", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      message: "Ingresá un correo válido."
    });
  }

  if (!process.env.CODE_SECRET) {
    return res.status(500).json({
      message: "El servidor todavía no está configurado."
    });
  }

  const code = crypto.randomInt(100000, 1000000).toString();

  codes.set(email, {
    hash: hashCode(email, code),
    expires: Date.now() + 10 * 60 * 1000,
    attempts: 0
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Tu código de verificación - FB DISTRIBUCION",
      text:
        `Tu código de verificación de FB DISTRIBUCION es: ${code}\n\n` +
        "Este código sirve únicamente para verificar tu correo en FB DISTRIBUCION. " +
        "No lo compartas con otras personas. Vence en 10 minutos."
    });

    return res.json({
      message: "Código enviado. Revisá tu correo y la carpeta de spam."
    });

  } catch (error) {
    codes.delete(email);
    console.error("Error al enviar el correo:", error.message);

    return res.status(500).json({
      message: "No se pudo enviar el correo. Intentá más tarde."
    });
  }
});

// Comprobar el código generado por FB DISTRIBUCION.
app.post("/api/verify-code", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").trim();

  const saved = codes.get(email);

  if (!saved || saved.expires < Date.now()) {
    codes.delete(email);

    return res.status(400).json({
      message: "El código venció o no existe. Solicitá uno nuevo."
    });
  }

  if (saved.attempts >= 5) {
    codes.delete(email);

    return res.status(429).json({
      message: "Se agotaron los intentos. Solicitá otro código."
    });
  }

  saved.attempts++;

  const submittedHash = hashCode(email, code);

  if (submittedHash !== saved.hash) {
    return res.status(400).json({
      message: "El código ingresado es incorrecto."
    });
  }

  codes.delete(email);

  return res.json({
    message: "Tu correo fue verificado correctamente."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
