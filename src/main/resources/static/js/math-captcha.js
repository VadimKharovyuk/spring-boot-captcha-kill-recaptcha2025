// MATH CAPTCHA MODULE
(function() {
    'use strict';

    let correctAnswer = 0;
    let num1 = 0;
    let num2 = 0;
    let operation = '+';

    /**
     * Функція генерування нового завдання
     */
    function generateNewCaptcha() {
        const operations = ['+', '-'];
        operation = operations[Math.floor(Math.random() * operations.length)];

        num1 = Math.floor(Math.random() * 10) + 1;  // 1-10
        num2 = Math.floor(Math.random() * 10) + 1;  // 1-10

        if (operation === '+') {
            correctAnswer = num1 + num2;
        } else {
            // Для віднімання робимо так, щоб відповідь була позитивною
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            correctAnswer = num1 - num2;
        }

        const questionElement = document.getElementById('captcha-question');
        if (questionElement) {
            questionElement.textContent = `Розв'яжіть: ${num1} ${operation} ${num2} = ?`;
        }

        const answerInput = document.getElementById('captcha-answer');
        if (answerInput) {
            answerInput.value = '';
        }

        console.log(`✓ Нова капча: ${num1} ${operation} ${num2} = ${correctAnswer}`);
    }

    /**
     * Валідація відповіді користувача
     */
    function validateCaptcha(userAnswer) {
        return parseInt(userAnswer) === correctAnswer;
    }

    /**
     * Отримати правильну відповідь (для тестування)
     */
    function getCorrectAnswer() {
        return correctAnswer;
    }

    /**
     * Ініціалізація компонента
     */
    function initMathCaptcha() {
        console.log('🚀 Ініціалізуємо математичну капчу');
        generateNewCaptcha();

        // Обновить капчу при кліку на кнопку
        const refreshBtn = document.getElementById('refresh-captcha');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔄 Користувач запросив нове завдання');
                generateNewCaptcha();
            });
        }

        // Перевірка перед відправленням форми
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                const honeypotWebsite = document.getElementById('honeypot_website')?.value || '';
                const honeypotPhone = document.getElementById('honeypot_phone')?.value || '';
                const userAnswer = document.getElementById('captcha-answer')?.value.trim() || '';

                // Honeypot перевірка
                if (honeypotWebsite || honeypotPhone) {
                    console.warn('⚠️ Honeypot спрацював! Бот спробував заповнити приховане поле');
                    e.preventDefault();
                    return false;
                }

                // Math CAPTCHA перевірка
                if (!validateCaptcha(userAnswer)) {
                    e.preventDefault();
                    alert('❌ Неправильна відповідь на завдання. Будь ласка, спробуйте ще раз.');
                    document.getElementById('captcha-answer')?.focus();
                    console.warn(`❌ Неправильна відповідь: ${userAnswer}, правильно: ${correctAnswer}`);
                    return false;
                }

                console.log('✅ Усі перевірки пройдені, відправляємо форму');
            });
        }
    }

    // Ініціалізація при завантаженні DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMathCaptcha);
    } else {
        initMathCaptcha();
    }

    // Експортуємо функції (якщо потрібні для тестування)
    window.MathCaptcha = {
        generateNewCaptcha: generateNewCaptcha,
        validateCaptcha: validateCaptcha,
        getCorrectAnswer: getCorrectAnswer
    };
})();