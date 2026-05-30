
'use client'

import { useState }
from 'react'

import {
  subscribeNewsletter
}
from '@/services/newsletter.service'

export default function
NewsletterStrip() {

  const [email, setEmail] =

    useState('')

  const [loading, setLoading] =

    useState(false)

  const [message, setMessage] =

    useState('')

  const handleSubscribe =
    async () => {

      try {

        setLoading(true)

        const response =

          await subscribeNewsletter(
            email
          )

        setMessage(
          response.message
        )

        setEmail('')

      } catch (error: any) {

        setMessage(

          error.response?.data?.message ||

          'Something went wrong'
        )

      } finally {

        setLoading(false)
      }
    }

  return (

    <section
      className="
        newsletter-strip
      "
    >

      <div className="container">

        <div className="newsletter-inner">

          <div>

            <div className="nl-label">

              The SIGNL Brief

            </div>

            <h2 className="nl-title">

              One signal daily.
              Before the market reacts.

            </h2>

            <p className="nl-sub">

              Strategic intelligence,
              deep analysis,
              macro systems
              and market structure.

            </p>

          </div>

          <div className="nl-form">

            <input

              type="email"

              value={email}

              onChange={(e) =>

                setEmail(
                  e.target.value
                )
              }

              placeholder="your@email.com"

              className="nl-input"
            />

            <button
              className="nl-btn"
              onClick={handleSubscribe}
              disabled={loading}
            >

              {

                loading
                  ? '...'
                  : 'Subscribe'
              }

            </button>

          </div>

        </div>

      </div>

       {message && (

  <div

    className={

      `nl-message ${
        message.includes('successfully')

          ? 'success'
          : 'error'
      }`
    }
  >

    {

      message.includes('successfully')

      ? (

        <>

          <span className="nl-icon">

            ✓

          </span>

          <span>

            You're subscribed to
            The SIGNL Brief.
            Daily intelligence
            will arrive before
            market open.

          </span>

        </>
      )

      : (

        <>

          <span className="nl-icon">

            •

          </span>

          <span>

            This email is already
            receiving SIGNL updates.

          </span>

        </>
      )
    }

  </div>
)}


    </section>
  )
}