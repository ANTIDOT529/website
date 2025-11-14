// Глобальные переменные
let currentCaptcha = '';
let slideIndex = 0;
let slideInterval;

// === МОБИЛЬНОЕ МЕНЮ ===

function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Меняем иконку меню
            if (mainNav.classList.contains('active')) {
                this.innerHTML = '✕';
                this.setAttribute('aria-label', 'Закрыть меню');
            } else {
                this.innerHTML = '☰';
                this.setAttribute('aria-label', 'Открыть меню');
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
                mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
                mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
            }
        });
    }
}

// === ФУНКЦИИ ВАЛИДАЦИИ ФОРМЫ ===

// Валидация имени
function validateName(name) {
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
}

// Валидация телефона
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.trim());
}

// Валидация сообщения
function validateMessage(message) {
    return message.trim().length <= 500;
}

// Функция показа ошибки
function showError(input, message) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('input-error');
    input.classList.remove('input-valid');
}

// Функция показа успеха
function showSuccess(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.classList.remove('input-error');
    input.classList.add('input-valid');
}

// Функция очистки валидации
function clearValidation(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.classList.remove('input-error', 'input-valid');
    input.style.color = '#fff';
    input.style.backgroundColor = '#333333';
    input.style.border = '1px #a7401b solid';
}

// Валидация всей формы
function validateForm() {
    let isValid = true;
    
    // Валидация имени
    const nameInput = document.querySelector('input[name="name"]');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Поле обязательно для заполнения');
        isValid = false;
    } else if (!validateName(nameInput.value)) {
        showError(nameInput, 'Имя должно содержать только буквы (2-50 символов)');
        isValid = false;
    } else {
        showSuccess(nameInput);
    }
    
    // Валидация телефона
    const phoneInput = document.querySelector('input[name="phone"]');
    if (!phoneInput.value.trim()) {
        showError(phoneInput, 'Поле обязательно для заполнения');
        isValid = false;
    } else if (!validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Введите корректный номер телефона');
        isValid = false;
    } else {
        showSuccess(phoneInput);
    }
    
    // Валидация сообщения
    const messageInput = document.querySelector('input[name="message"]');
    if (messageInput.value && !validateMessage(messageInput.value)) {
        showError(messageInput, 'Сообщение не должно превышать 500 символов');
        isValid = false;
    } else if (messageInput.value) {
        showSuccess(messageInput);
    } else {
        clearValidation(messageInput);
    }
    
    // Валидация капчи
    if (!validateCaptcha()) {
        isValid = false;
    }
    
    return isValid;
}

// === ФУНКЦИИ КАПЧИ ===

// Функция генерации капчи
function generateCaptcha() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    const length = 6;
    
    for (let i = 0; i < length; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return captcha;
}

// Функция отображения капчи
function displayCaptcha() {
    currentCaptcha = generateCaptcha();
    const captchaText = document.getElementById('captcha-text');
    
    if (captchaText) {
        captchaText.textContent = currentCaptcha;
    }
}

// Функция проверки капчи
function validateCaptcha() {
    const captchaInput = document.getElementById('captcha-input');
    
    if (!captchaInput || !currentCaptcha) {
        return false;
    }
    
    const userInput = captchaInput.value.trim();
    
    if (userInput === currentCaptcha) {
        captchaInput.classList.remove('captcha-invalid', 'input-error');
        captchaInput.classList.add('captcha-valid', 'input-valid');
        
        const formGroup = captchaInput.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        return true;
    } else {
        captchaInput.classList.remove('captcha-valid', 'input-valid');
        captchaInput.classList.add('captcha-invalid', 'input-error');
        
        const formGroup = captchaInput.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = 'Неверный текст с картинки';
        
        return false;
    }
}

// Инициализация капчи
function initCaptcha() {
    displayCaptcha();
    
    // Обработчик для кнопки обновления капчи
    const refreshBtn = document.getElementById('refresh-captcha');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            displayCaptcha();
            const captchaInput = document.getElementById('captcha-input');
            if (captchaInput) {
                captchaInput.value = '';
                clearValidation(captchaInput);
            }
        });
    }
    
    // Валидация при вводе
    const captchaInput = document.getElementById('captcha-input');
    if (captchaInput) {
        captchaInput.addEventListener('input', function() {
            setTimeout(validateCaptcha, 300);
        });
    }
}

// Инициализация валидации формы
function initFormValidation() {
    const nameInput = document.querySelector('input[name="name"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const messageInput = document.querySelector('input[name="message"]');
    
    // Валидация имени при вводе
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                if (!validateName(this.value)) {
                    showError(this, 'Имя должно содержать только буквы (2-50 символов)');
                } else {
                    showSuccess(this);
                }
            } else {
                clearValidation(this);
            }
        });
    }
    
    // Валидация телефона при вводе
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                if (!validatePhone(this.value)) {
                    showError(this, 'Введите корректный номер телефона');
                } else {
                    showSuccess(this);
                }
            } else {
                clearValidation(this);
            }
        });
    }
    
    // Валидация сообщения при вводе
    if (messageInput) {
        const messageCounter = document.createElement('div');
        messageCounter.className = 'message-counter';
        messageCounter.textContent = '0/500 символов';
        messageInput.parentElement.appendChild(messageCounter);
        
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            messageCounter.textContent = `${length}/500 символов`;
            
            if (length > 500) {
                messageCounter.style.color = '#ff4444';
            } else if (length > 400) {
                messageCounter.style.color = '#ffaa00';
            } else {
                messageCounter.style.color = '#ccc';
            }
            
            if (this.value.trim()) {
                if (!validateMessage(this.value)) {
                    showError(this, 'Сообщение не должно превышать 500 символов');
                } else {
                    showSuccess(this);
                }
            } else {
                clearValidation(this);
            }
        });
    }
    
    // Обработчик отправки формы (ИМИТАЦИЯ ОТПРАВКИ)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const submitBtn = this.querySelector('.bot-send-mail');
                const originalText = submitBtn.value;
                submitBtn.value = 'Отправка...';
                submitBtn.disabled = true;
                
                // ИМИТАЦИЯ ОТПРАВКИ ФОРМЫ
                console.log('Имитация отправки формы с данными:');
                console.log('Имя:', document.querySelector('input[name="name"]').value);
                console.log('Телефон:', document.querySelector('input[name="phone"]').value);
                console.log('Сообщение:', document.querySelector('input[name="message"]').value);
                
                // Имитация задержки сети
                setTimeout(function() {
                    // Успешная "отправка"
                    alert('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                    
                    // Очистка формы
                    contactForm.reset();
                    displayCaptcha();
                    
                    // Сбрасываем стили валидации
                    const inputs = contactForm.querySelectorAll('input');
                    inputs.forEach(input => clearValidation(input));
                    
                    // Сбрасываем счетчик сообщений
                    const messageCounter = document.querySelector('.message-counter');
                    if (messageCounter) {
                        messageCounter.textContent = '0/500 символов';
                        messageCounter.style.color = '#ccc';
                    }
                    
                    // Восстанавливаем кнопку
                    submitBtn.value = originalText;
                    submitBtn.disabled = false;
                }, 1500); // Имитация задержки отправки
            } else {
                alert('Пожалуйста, исправьте ошибки в форме.');
            }
        });
    }
}

// === ПЕРВЫЙ СЛАЙДЕР ===

function initFirstSlider() {
    const slider = document.querySelector('.slider');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    if (!slider) return;
    
    const slides = Array.from(slider.querySelectorAll('img'));
    const slideCount = slides.length;
    
    if (slideCount === 0) return;
    
    function startAutoSlide() {
        slideInterval = setInterval(showNextSlide, 3000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    function showPreviousSlide() {
        slideIndex = (slideIndex - 1 + slideCount) % slideCount;
        updateSlider();
    }
    
    function showNextSlide() {
        slideIndex = (slideIndex + 1) % slideCount;
        updateSlider();
    }
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.style.transition = 'opacity 0.5s ease-in-out';
            
            if (index === slideIndex) {
                slide.style.display = 'block';
                setTimeout(() => {
                    slide.style.opacity = '1';
                }, 10);
            } else {
                slide.style.opacity = '0';
                setTimeout(() => {
                    if (index !== slideIndex) {
                        slide.style.display = 'none';
                    }
                }, 500);
            }
        });
    }
    
    // Добавляем обработчики
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            stopAutoSlide();
            showPreviousSlide();
            startAutoSlide();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            stopAutoSlide();
            showNextSlide();
            startAutoSlide();
        });
    }
    
    // Инициализация
    updateSlider();
    startAutoSlide();
    
    // Обработчики для автопереключения
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// === ПОЛНОЭКРАННЫЙ РЕЖИМ ===

function openFullscreenImage(element) {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const fullscreenImage = document.getElementById('fullscreen-image');
    
    if (fullscreenContainer && fullscreenImage) {
        fullscreenImage.src = element.src;
        fullscreenContainer.style.display = 'block';
        
        // Добавляем обработчик для закрытия по клику на фон
        fullscreenContainer.addEventListener('click', function(e) {
            if (e.target === fullscreenContainer) {
                closeFullscreenImage();
            }
        });
        
        // Добавляем обработчик для закрытия по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFullscreenImage();
            }
        });
    }
}

function closeFullscreenImage() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    if (fullscreenContainer) {
        fullscreenContainer.style.display = 'none';
        
        // Удаляем обработчики
        fullscreenContainer.removeEventListener('click', closeFullscreenImage);
        document.removeEventListener('keydown', closeFullscreenImage);
    }
}

// === КНОПКА "НАВЕРХ" ===

function initScrollToTop() {
    function scrollFunction() {
        const scrollButton = document.getElementById('scrollToTopButton');
        if (scrollButton) {
            if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
                scrollButton.style.display = 'block';
            } else {
                scrollButton.style.display = 'none';
            }
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Обработчик скролла
    window.addEventListener('scroll', scrollFunction);
    
    // Обработчик клика по кнопке
    const scrollButton = document.getElementById('scrollToTopButton');
    if (scrollButton) {
        scrollButton.addEventListener('click', scrollToTop);
    }
}

// === ПЛАВНАЯ ПРОКРУТКА ДЛЯ ССЫЛОК ===

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Инициализация всех компонентов
    initFirstSlider();
    initCaptcha();
    initFormValidation();
    initScrollToTop();
    initSmoothScroll();
    initMobileMenu();
    
    console.log('All components initialized');
});

// Глобальные функции для полноэкранного режима
window.openFullscreenImage = openFullscreenImage;
window.closeFullscreenImage = closeFullscreenImage;
