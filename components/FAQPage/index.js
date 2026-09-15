import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

function FAQPage() {
  const [openFaqId, setOpenFaqId] = useState(null);
  const router = useRouter();

  // Split FAQ data into two columns
  const leftColumnFaqs = [
    {
      id: 1,
      question: 'What is famstep?',
      answer: 'famstep is a Business Network & Collaboration platform equipped with CRM capabilities that provides independent workers (freelancers, solopreneurs, small business owners) the right tools to work more efficiently and collaborate together on various short-term projects to make more money.'
    },
    {
      id: 2,
      question: 'How to get started on famstep?',
      answer: 'Getting started is easy! Simply sign up for an account, complete your profile, and start exploring our features.'
    },
    {
      id: 3,
      question: 'What type of features does famstep offer?',
      answer: 'We offer comprehensive project management, team collaboration, CRM systems, and more.'
    }
  ];

  const rightColumnFaqs = [
    {
      id: 4,
      question: 'What is the refund policy?',
      answer: 'We offer a 30-day money-back guarantee on all our services.'
    },
    {
      id: 5,
      question: 'What is famstep philosophy?',
      answer: 'We believe in empowering independent workers and fostering meaningful collaboration.'
    },
    {
      id: 6,
      question: 'What is famstep take on data migration and integration?',
      answer: 'We provide seamless data migration and integration with popular platforms.'
    }
  ];

  return (
    <div className={styles.faqContainer}>
      <h1>FAQs</h1>
      
      <div className={styles.faqColumns}>
        <div className={styles.faqColumn}>
          {leftColumnFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className={styles.faqItem}
            >
              <button 
                className={styles.faqQuestion}
                onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
              >
                {faq.question}
                <span className={styles.icon}>
                  {openFaqId === faq.id ? '×' : '+'}
                </span>
              </button>
              {openFaqId === faq.id && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.faqColumn}>
          {rightColumnFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className={styles.faqItem}
            >
              <button 
                className={styles.faqQuestion}
                onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
              >
                {faq.question}
                <span className={styles.icon}>
                  {openFaqId === faq.id ? '×' : '+'}
                </span>
              </button>
              {openFaqId === faq.id && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contactSection}>
        <h2>Still have a question?</h2>
        <p>Feel free to contact us.</p>
        <button 
          className={styles.contactButton}
          onClick={() => router.push('/contact')}
        >
          CONTACT US <span>→</span>
        </button>
      </div>
    </div>
  )
}

export default FAQPage
