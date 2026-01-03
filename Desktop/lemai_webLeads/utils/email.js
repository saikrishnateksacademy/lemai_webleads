import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY)

const buildOtpTemplate = (code) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fc;padding:30px;font-family:Arial">
  <tr>
    <td align="center">
      <table width="500" style="background:#ffffff;padding:30px;border-radius:10px">
        <tr>
          <td align="center" style="font-size:22px;font-weight:700">Email Verification</td>
        </tr>
        <tr>
          <td align="center" style="padding-top:10px;color:#555">
            Use the OTP below. It expires in <b>5 minutes</b>.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:25px 0">
            <div style="font-size:34px;font-weight:700;letter-spacing:4px;background:#111;color:#fff;padding:15px 25px;border-radius:8px">
              ${code}
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-size:12px;color:#777">
            If you didn’t request this, ignore this email.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

export const sendEmail = async ({ to, subject, text, html, otp }) => {
  await sgMail.send({
    to,
    from: {
      email: process.env.SENDGRID_SENDER,
      name: process.env.SENDGRID_NAME || "Lead System"
    },
    subject,
    text: text || `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: html || buildOtpTemplate(otp)
  });
};
