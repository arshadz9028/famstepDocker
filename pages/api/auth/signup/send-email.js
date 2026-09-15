// pages/api/send-email.js
import ses from '../../../../config/awsSES';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { to, subject, text, html } = req.body;

  // Ensure text and html are not undefined
  const emailText = text || 'Please use an HTML-capable email client to view this message.';
  const emailHtml = html || '<p>No HTML content available</p>';

  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Text: {
          Data: emailText,
          Charset: 'UTF-8'
        },
        Html: {
          Data: emailHtml,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      }
    },
    Source: 'Famstep <' + process.env.SES_VERIFIED_EMAIL + '>'
  };

  try {
    await ses.sendEmail(params).promise();
    res.status(200).send({ message: 'Email sent' });
  } catch (error) {
    console.error('SES Error:', error);
    res.status(500).send({ message: 'Failed to send email', error: error.message });
  }
}
