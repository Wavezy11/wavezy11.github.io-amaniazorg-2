document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Script loaded successfully")

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const headerOffset = document.querySelector(".header")?.offsetHeight || 0
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerOffset - 20

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const navList = document.querySelector(".nav-list")
        const hamburgerMenu = document.querySelector(".hamburger-menu")
        if (navList?.classList.contains("active")) {
          navList.classList.remove("active")
          hamburgerMenu?.setAttribute("aria-expanded", "false")
          document.body.style.overflow = ""
        }
      }
    })
  })
// Mobile navigation
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-list .nav-link");
const closeMenu = document.querySelector(".close-menu");

// Create overlay element for mobile menu
let navOverlay = document.querySelector(".nav-overlay");
if (!navOverlay) {
  navOverlay = document.createElement("div");
  navOverlay.className = "nav-overlay";
  document.body.appendChild(navOverlay);
}

function closeMobileMenu() {
  navList.classList.remove("active");
  navOverlay.classList.remove("active");
  hamburgerMenu.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (hamburgerMenu && navList) {
  // Open / close toggle
  hamburgerMenu.addEventListener("click", () => {
    const isActive = navList.classList.contains("active");

    if (isActive) {
      closeMobileMenu();
    } else {
      navList.classList.add("active");
      navOverlay.classList.add("active");
      hamburgerMenu.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  });

  // Nav links sluiten menu
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Overlay sluiten
  navOverlay.addEventListener("click", closeMobileMenu);

  // ✅ Close button sluiten
  if (closeMenu) {
    closeMenu.addEventListener("click", closeMobileMenu);
  }
}

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top")
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  const initializeCheckboxes = () => {
    console.log("[v0] Initializing checkboxes")
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]')
    console.log("[v0] Found checkboxes:", checkboxes.length)

    checkboxes.forEach((checkbox, index) => {
      console.log("[v0] Setting up checkbox", index, checkbox.id)

      // Remove existing event listeners to prevent duplicates
      checkbox.removeEventListener("change", handleCheckboxChange)
      checkbox.removeEventListener("keydown", handleCheckboxKeydown)

      // Add event listeners
      checkbox.addEventListener("change", handleCheckboxChange)
      checkbox.addEventListener("keydown", handleCheckboxKeydown)

      // Make sure the checkbox item is clickable
      const checkboxItem = checkbox.closest(".checkbox-item")
      if (checkboxItem) {
        checkboxItem.style.cursor = "pointer"
        checkboxItem.addEventListener("click", (e) => {
          // Only trigger if clicking on the item itself, not the checkbox
          if (
            e.target === checkboxItem ||
            e.target.classList.contains("checkbox-text") ||
            e.target.classList.contains("checkmark")
          ) {
            e.preventDefault()
            checkbox.checked = !checkbox.checked
            checkbox.dispatchEvent(new Event("change"))
          }
        })
      }
    })
  }

  function handleCheckboxChange() {
    console.log("[v0] Checkbox changed:", this.id, this.checked)
    const checkboxItem = this.closest(".checkbox-item")
    const checkmark = checkboxItem?.querySelector(".checkmark")

    if (this.checked) {
      checkboxItem?.classList.add("checked")
      if (checkmark) {
        checkmark.style.transform = "scale(1.1)"
        setTimeout(() => {
          checkmark.style.transform = "scale(1)"
        }, 150)
      }
    } else {
      checkboxItem?.classList.remove("checked")
    }
  }

  function handleCheckboxKeydown(e) {
    if (e.key === " ") {
      e.preventDefault()
      this.checked = !this.checked
      this.dispatchEvent(new Event("change"))
    }
  }

  // Initialize checkboxes
  initializeCheckboxes()

  // Form validation functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-+]/g, "")
    return /^\d{10,}$/.test(cleanPhone)
  }

  function showError(input, message) {
    const formGroup = input.closest(".form-group")
    formGroup?.classList.add("error")

    const existingError = formGroup?.querySelector(".form-error")
    if (existingError) {
      existingError.remove()
    }

    const errorElement = document.createElement("span")
    errorElement.className = "form-error"
    errorElement.textContent = message
    input.parentNode?.appendChild(errorElement)
  }

  function clearError(input) {
    const formGroup = input.closest(".form-group")
    formGroup?.classList.remove("error")
    const errorElement = formGroup?.querySelector(".form-error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  // Contact form handling
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      let isValid = true

      const nameInput = contactForm.querySelector("#contact-name")
      const emailInput = contactForm.querySelector("#contact-email")
      const messageInput = contactForm.querySelector("#contact-message")

      // Clear previous errors
      if (nameInput) clearError(nameInput)
      if (emailInput) clearError(emailInput)
      if (messageInput) clearError(messageInput)

      // Validate fields
      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, "Naam is verplicht.")
        isValid = false
      }

      if (emailInput) {
        if (!emailInput.value.trim()) {
          showError(emailInput, "E-mailadres is verplicht.")
          isValid = false
        } else if (!validateEmail(emailInput.value)) {
          showError(emailInput, "Voer een geldig e-mailadres in.")
          isValid = false
        }
      }

      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, "Bericht is verplicht.")
        isValid = false
      }

      if (isValid) {
        try {
          const formData = new FormData(contactForm)
          const response = await fetch("https://formspree.io/f/mvgbgekp", {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          })

          if (response.ok) {
            alert("Bedankt voor uw bericht! Wij nemen zo spoedig mogelijk contact met u op.")
            contactForm.reset()
          } else {
            throw new Error("Failed to send message")
          }
        } catch (error) {
          console.error("Error sending message:", error)
          alert("Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het later opnieuw.")
        }
      }
    })
  }

  // Signup form handling
  const signupForm = document.querySelector(".signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      console.log("[v0] Signup form submitted")
      let isValid = true

      const nameInput = signupForm.querySelector("#applicant-name")
      const emailInput = signupForm.querySelector("#applicant-email")
      const phoneInput = signupForm.querySelector("#applicant-phone")
      const checkboxes = signupForm.querySelectorAll('input[name="hulpvraag[]"]:checked')
      const messageInput = signupForm.querySelector("#applicant-message")

      console.log("[v0] Checked checkboxes:", checkboxes.length)

      // Clear previous errors
      signupForm.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error")
        const errorElement = group.querySelector(".form-error")
        if (errorElement) {
          errorElement.remove()
        }
      })

      // Validate fields
      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, "Naam is verplicht.")
        isValid = false
      }

      if (emailInput) {
        if (!emailInput.value.trim()) {
          showError(emailInput, "E-mailadres is verplicht.")
          isValid = false
        } else if (!validateEmail(emailInput.value)) {
          showError(emailInput, "Voer een geldig e-mailadres in.")
          isValid = false
        }
      }

      if (phoneInput) {
        if (!phoneInput.value.trim()) {
          showError(phoneInput, "Telefoonnummer is verplicht.")
          isValid = false
        } else if (!validatePhone(phoneInput.value)) {
          showError(phoneInput, "Voer een geldig telefoonnummer in (minimaal 10 cijfers).")
          isValid = false
        }
      }

      // Validate checkboxes
      if (checkboxes.length === 0) {
        const checkboxGroup = signupForm.querySelector(".checkbox-group")
        const formGroup = checkboxGroup?.closest(".form-group")
        if (formGroup) {
          formGroup.classList.add("error")
          const errorElement = document.createElement("span")
          errorElement.className = "form-error"
          errorElement.textContent = "Selecteer minimaal één hulpvraag."
          checkboxGroup.parentNode?.appendChild(errorElement)
        }
        isValid = false
      }

      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, "Bericht is verplicht.")
        isValid = false
      }

      if (isValid) {
        try {
          const formData = new FormData(signupForm)
          const response = await fetch("https://formspree.io/f/mvgbgekp", {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          })

          if (response.ok) {
            alert("Bedankt voor uw aanmelding! Wij nemen zo spoedig mogelijk contact met u op.")
            signupForm.reset()
            // Reset checkbox visual states
            const allCheckboxes = signupForm.querySelectorAll('.checkbox-item input[type="checkbox"]')
            allCheckboxes.forEach((checkbox) => {
              const checkboxItem = checkbox.closest(".checkbox-item")
              checkboxItem?.classList.remove("checked")
            })
          } else {
            throw new Error("Failed to send signup")
          }
        } catch (error) {
          console.error("Error sending signup:", error)
          alert("Er is een fout opgetreden bij het verzenden van uw aanmelding. Probeer het later opnieuw.")
        }
      }
    })
  }

  const sections = document.querySelectorAll(".section")
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    section.classList.add("fade-in")
    sectionObserver.observe(section)
  })

  const scrollspyNav = document.querySelector(".scrollspy-nav")
  const mobileProgressIndicator = document.querySelector(".mobile-progress-indicator")
  const timelineItems = document.querySelectorAll(".timeline-item")
  const progressItems = document.querySelectorAll(".progress-item")
  const scrollspySections = document.querySelectorAll("#intro, #diensten, #over-ons, #werkwijze, #contact")
  let hideTimeout

  function showScrollspy() {
    if (!scrollspyNav || window.innerWidth <= 768) return
    scrollspyNav.classList.add("visible")
    clearTimeout(hideTimeout)
    hideTimeout = setTimeout(() => {
      scrollspyNav.classList.remove("visible")
    }, 1500)
  }

  const scrollspyWatchSections = document.querySelectorAll("section[id]")
  const mobileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && window.innerWidth > 768) {
          showScrollspy()
        }
      })
    },
    { threshold: 0.6 },
  )

  if (window.innerWidth > 768) {
    scrollspyWatchSections.forEach((section) => mobileObserver.observe(section))
  }

  // Function to control scrollspy visibility
  const controlScrollspyVisibility = () => {
    if ((!scrollspyNav && !mobileProgressIndicator) || window.innerWidth <= 768) return

    const heroSection = document.querySelector("#hero")
    const introSection = document.querySelector("#intro")
    const currentScroll = window.pageYOffset
    const headerHeight = document.querySelector(".header").offsetHeight

    // Show scrollspy when we reach the intro section (desktop only)
    if (heroSection && introSection && window.innerWidth > 768) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
      const introTop = introSection.offsetTop

      if (currentScroll >= introTop - headerHeight - 100) {
        if (scrollspyNav) scrollspyNav.classList.add("visible")
      } else {
        if (scrollspyNav) scrollspyNav.classList.remove("visible")
      }
    }
  }

  // Enhanced Intersection Observer for scrollspy (desktop only)
  const scrollspyObserver = new IntersectionObserver(
    (entries, observer) => {
      if (window.innerWidth <= 768) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id

          // Update active states for timeline items
          timelineItems.forEach((item) => {
            item.classList.remove("active")
            if (item.dataset.target === sectionId) {
              item.classList.add("active")
              item.querySelector(".timeline-marker").setAttribute("aria-current", "true")
            } else {
              item.querySelector(".timeline-marker").removeAttribute("aria-current")
            }
          })

          // Update URL hash without jumping
          if (history.replaceState) {
            history.replaceState(null, null, `#${sectionId}`)
          }
        }
      })
    },
    {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    },
  )

  if (window.innerWidth > 768) {
    scrollspySections.forEach((section) => {
      scrollspyObserver.observe(section)
    })
  }

  // Click handlers for timeline items
  timelineItems.forEach((item) => {
    const marker = item.querySelector(".timeline-marker")
    const label = item.querySelector(".timeline-label")

    const clickHandler = (e) => {
      e.preventDefault()
      const targetId = item.dataset.target
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const header = document.querySelector(".header")
        const footer = document.querySelector(".footer")
        const headerOffset = header ? header.offsetHeight : 0
        const mobileProgressOffset = window.innerWidth <= 768 ? 60 : 0
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
        let offsetPosition = elementPosition - headerOffset - mobileProgressOffset - 20

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const footerHeight = footer ? footer.offsetHeight : 0
        const minScroll = headerOffset

        offsetPosition = Math.max(minScroll, Math.min(offsetPosition, maxScroll - footerHeight))

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }

    const keyHandler = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        clickHandler(e)
      }
    }

    marker.addEventListener("click", clickHandler)
    marker.addEventListener("keydown", keyHandler)
    label.addEventListener("click", clickHandler)
  })

  // Click handlers for mobile progress items
  progressItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = item.dataset.target
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const header = document.querySelector(".header")
        const footer = document.querySelector(".footer")
        const headerOffset = header ? header.offsetHeight : 0
        const mobileProgressOffset = 60
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
        let offsetPosition = elementPosition - headerOffset - mobileProgressOffset - 20

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const footerHeight = footer ? footer.offsetHeight : 0
        const minScroll = headerOffset

        offsetPosition = Math.max(minScroll, Math.min(offsetPosition, maxScroll - footerHeight))

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  const initializeScrollspy = () => {
    if (window.innerWidth <= 768) return

    controlScrollspyVisibility()

    const hash = window.location.hash.substring(1)
    if (hash && scrollspySections.length > 0) {
      const targetSection = document.getElementById(hash)
      if (targetSection) {
        // Set initial active state
        timelineItems.forEach((item) => {
          item.classList.remove("active")
          if (item.dataset.target === hash) {
            item.classList.add("active")
            item.querySelector(".timeline-marker").setAttribute("aria-current", "true")
          }
        })
      }
    } else {
      // Set first section as active by default
      if (timelineItems.length > 0) {
        timelineItems[0].classList.add("active")
        timelineItems[0].querySelector(".timeline-marker").setAttribute("aria-current", "true")
      }
    }
  }

  // Initialize scrollspy (desktop only)
  initializeScrollspy()

  window.addEventListener("scroll", () => {
    controlScrollspyVisibility()
  })

  // Handle browser back/forward navigation
  window.addEventListener("popstate", initializeScrollspy)

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      // Hide scrollspy on mobile
      if (scrollspyNav) scrollspyNav.classList.remove("visible")
      if (mobileProgressIndicator) mobileProgressIndicator.classList.remove("visible")
    } else {
      // Reinitialize scrollspy on desktop
      initializeScrollspy()
    }
  })
})
