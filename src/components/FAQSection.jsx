
import React, { useState } from 'react';

const FAQItem = ({ question, answer, initialOpen }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question}</h3>
        <svg
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 dark:text-gray-300 pr-8">
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: 'What is life insurance and why do I need it?',
      answer: 'Life insurance is a contract between you and an insurance company. In exchange for regular premium payments, the insurer pays a lump sum amount (death benefit) to your beneficiaries upon your death. It provides financial security for your loved ones, covering expenses like mortgages, education, and daily living costs.',
    },
    {
      question: 'How do I determine the right coverage amount?',
      answer: 'The ideal coverage amount depends on various factors such as your income, debts, future financial obligations (e.g., children\'s education), and your family\'s lifestyle. A common guideline is 10-15 times your annual income, but it\'s best to use our quote tool or consult with an agent for a personalized assessment.',
    },
    {
      question: 'What is the difference between term life and whole life insurance?',
      answer: 'Term life insurance provides coverage for a specific period (e.g., 10, 20, or 30 years) and pays a death benefit if you pass away within that term. Whole life insurance, on the other hand, provides lifelong coverage and includes a cash value component that grows over time, which you can borrow against or withdraw.',
    },
    {
      question: 'Can I get a quote without providing personal information?',
      answer: 'Yes, our initial quote tool allows you to get an estimated premium by providing basic information like age, gender, coverage amount, and duration, without requiring sensitive personal details. You only provide more detailed information when you decide to apply for a policy.',
    },
    {
      question: 'How long does the application process take?',
      answer: 'The online application process is designed to be quick and efficient, typically taking 15-30 minutes to complete. Once submitted, the approval timeline can vary depending on the policy type and any required medical underwriting, but we strive to keep you informed every step of the way.',
    },
  ];

  return (
    <section id="faq-section" className="py-16 bg-white dark:bg-gray-900 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12 sm:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} initialOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
