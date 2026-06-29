export const contactUserTemplate = ({
  name,
  subject,
}) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Thank You for Contacting Us 🙏</h2>

      <p>Hi ${name},</p>

      <p>
        We have received your message regarding:
      </p>

      <p>
        <strong>${subject}</strong>
      </p>

      <p>
        Our team will get back to you shortly.
      </p>

      <br />

      <p>
        Regards,<br />
        Support Team
      </p>
    </div>
  `;
};