"use server"

import { redirect } from "next/navigation"

export async function sendContactEmail(formData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const subject = formData.get("subject")
  const message = formData.get("message")

  // Use environment variable for secure email handling
  const recipientEmail = process.env.CONTACT_EMAIL || "fallback@example.com"

  try {
    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll use a simple fetch to Formspree with environment variables
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
      redirect("/bedankt")
    } else {
      throw new Error("Failed to send email")
    }
  } catch (error) {
    console.error("Error sending email:", error)
    redirect("/error")
  }
}

export async function sendSignupEmail(formData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const geboortedatum = formData.get("geboortedatum")
  const adres = formData.get("adres")
  const postcode = formData.get("postcode")
  const woonplaats = formData.get("woonplaats")
  const hulpvraag = formData.getAll("hulpvraag[]")
  const message = formData.get("message")

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
        hulpvraag: hulpvraag.join(", "),
        message,
        _to: recipientEmail,
        _subject: "Nieuwe aanmelding - Amania Zorg",
        _replyto: email,
      }),
    })

    if (response.ok) {
      redirect("/bedankt")
    } else {
      throw new Error("Failed to send email")
    }
  } catch (error) {
    console.error("Error sending email:", error)
    redirect("/error")
  }
}
