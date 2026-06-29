const otpTemplate = (otp) => {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2>Email Verification</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>
        This OTP is valid for
        5 minutes.
      </p>
    </div>
  `;
};

export default otpTemplate;