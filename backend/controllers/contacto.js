import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarContacto = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, asunto, mensaje } = req.body;

    if (!nombre || !apellido || !email || !asunto || !mensaje) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // llega a tu propio correo
      replyTo: email,
      subject: `📩 Nuevo mensaje de contacto — ${asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">📩 Nuevo Mensaje de Contacto</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">TechStore Pro</p>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-size: 13px;">Nombre completo</span><br/>
                  <strong style="color: #111;">${nombre} ${apellido}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-size: 13px;">Correo electrónico</span><br/>
                  <strong style="color: #4F46E5;">${email}</strong>
                </td>
              </tr>
              ${telefono ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-size: 13px;">Teléfono</span><br/>
                  <strong style="color: #111;">${telefono}</strong>
                </td>
              </tr>` : ""}
              ${direccion ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-size: 13px;">Dirección</span><br/>
                  <strong style="color: #111;">${direccion}</strong>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-size: 13px;">Asunto</span><br/>
                  <strong style="color: #111;">${asunto}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <span style="color: #6b7280; font-size: 13px;">Mensaje</span><br/>
                  <p style="color: #111; margin: 8px 0 0; line-height: 1.6; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${mensaje}</p>
                </td>
              </tr>
            </table>

            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${email}" style="background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Responder a ${nombre}
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2025 TechStore Pro — Formulario de Contacto</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar mensaje de contacto:", error);
    res.status(500).json({ message: "Error al enviar el mensaje", error: error.message });
  }
};