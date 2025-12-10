export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, phone, geboortedatum, adres, postcode, woonplaats, message } = req.body
  const hulpvraag = req.body["hulpvraag[]"] || []

  // Use environment variable for secure email handling
  const recipientEmail = process.env.SIGNUP_EMAIL || process.env.CONTACT_EMAIL || "fallback@example.com"

  try {
    const response = await fetch("https://formspree.io/f/mvgbgekp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        geboortedatum,
        adres,
        postcode,
        woonplaats,
        hulpvraag: Array.isArray(hulpvraag) ? hulpvraag.join(", ") : hulpvraag,
        message,
        _to: recipientEmail,
        _subject: "Nieuwe aanmelding - Amania Zorg",
        _replyto: email,
      }),
    })

    if (response.ok) {
      return res.status(200).json({ message: "Signup email sent successfully" })
    } else {
      throw new Error("Failed to send email")
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return res.status(500).json({ message: "Failed to send email" })
  }
}
