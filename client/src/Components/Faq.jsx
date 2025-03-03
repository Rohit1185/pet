import { useState } from 'react';
import '../assets/faq.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    { question: "What is pet adoption?", answer: "Pet adoption refers to the process of taking a pet, typically from a shelter or rescue organization, into your home and providing a safe and loving environment for them." },
    { question: "How do I adopt a pet?", answer: "To adopt a pet, you need to browse available pets, fill out an adoption application form, meet the pet, and if you’re a good match, sign an adoption agreement." },
    { question: "What are the adoption fees?", answer: "Adoption fees typically cover the costs of vaccinations, spaying/neutering, and medical care provided to the pet before adoption. Fees may vary by pet and shelter." },
    { question: "Do I need to spay or neuter my pet?", answer: "Yes, spaying or neutering your pet is important for health and behavioral reasons. Most shelters will have this done before adoption, but some may require it post-adoption." },
    { question: "Can I adopt a pet if I have other pets at home?", answer: "Yes, many families adopt pets even with other pets. It’s important to introduce them gradually, and choose a pet with a compatible temperament for your existing pets." },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'open' : ''}`}
            onClick={() => toggleAnswer(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="faq-toggle">{activeIndex === index ? '−' : '+'}</span>
            </div>
            {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
