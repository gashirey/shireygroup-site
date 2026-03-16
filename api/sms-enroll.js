export default async function handler(req, res) {

if (req.method !== 'POST') {
return res.status(405).send('Method not allowed');
}

const { first_name, last_name, phone } = req.body;

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

const body =
"SEG: Confirm enrollment for contractor deployment alerts. Reply YES to confirm.";

const response = await fetch(
`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
{
method: 'POST',
headers: {
Authorization:
"Basic " +
Buffer.from(accountSid + ":" + authToken).toString("base64"),
"Content-Type": "application/x-www-form-urlencoded"
},
body: new URLSearchParams({
To: phone,
From: process.env.TWILIO_NUMBER,
Body: body
})
}
);

return res.status(200).send("Enrollment received. Please confirm via SMS.");
}
