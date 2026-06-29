export const contactAdminTemplate = ({
  name,
  email,
  mobile,
  subject,
  message,
}) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>📩 New Contact Form Submission</h2>

      <table cellpadding="8" cellspacing="0" border="1">
        <tr>
          <td><strong>Name</strong></td>
          <td>${name}</td>
        </tr>

        <tr>
          <td><strong>Email</strong></td>
          <td>${email}</td>
        </tr>

        <tr>
          <td><strong>Mobile</strong></td>
          <td>${mobile}</td>
        </tr>

        <tr>
          <td><strong>Subject</strong></td>
          <td>${subject}</td>
        </tr>

        <tr>
          <td><strong>Message</strong></td>
          <td>${message}</td>
        </tr>
      </table>
    </div>
  `;
};