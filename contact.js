export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, phone, subject, message } = req.body

  // Use environment variable for secure email handling
  const recipientEmail = process.env.CONTACT_EMAIL || "fallback@example.com"

  try {
    // Use Formspree with environment variables for secure email handling
    const response = await fetch("https://formspree.io/f/mvgbgekp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        message,
        _to: recipientEmail,
        _subject: `Contact formulier - ${subject}`,
        _replyto: email,
      }),
    })

    if (response.ok) {
      return res.status(200).json({ message: "Email sent successfully" })
    } else {
      throw new Error("Failed to send email")
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return res.status(500).json({ message: "Failed to send email" })
  }
}
