// DOM Elements
const header = document.querySelector("header");
const themeToggle = document.querySelector(".theme-toggle");
const mobileToggle = document.querySelector(".mobile-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const closeNav = document.querySelector(".close-nav");
const overlay = document.querySelector(".overlay");
const backToTop = document.querySelector(".back-to-top");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-links a");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectLinks = document.querySelectorAll(".project-link[data-project]");
const projectModal = document.getElementById("projectModal");
const closeModal = document.querySelector(".close-modal");
const projectDetails = document.querySelector(".project-details");
const contactForm = document.getElementById("contactForm");
const footerLinks = document.querySelectorAll(".footer-links a");
const heroButtons = document.querySelectorAll(".hero-btns a");

// Project Data
const projectsData = {
  "auto-control-app": {
    titleKey: "project-auto-control-title",
    image:
      '<img src="images/projects" alt="Aplicativo de Autocontrole Empresarial">',
    tags: ["Kotlin", "Android", "Java", "SQL"],
    descriptionPt: `<p>Aplicativo para controle empresarial desenvolvido com Kotlin e Java para Android, utilizando banco de dados SQL.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Desenvolvimento de um aplicativo de autocontrole empresarial para Android.</li>
                <li>Implementação utilizando Kotlin e Java com banco de dados SQL.</li>
                <li>Funcionalidades de gerenciamento de dados empresariais e controle de processos.</li>
                <li>Interface intuitiva e eficiente para facilitar a operação diária.</li>
                <li>Habilidades: Kotlin, Android, Java, SQL, Git, Desenvolvimento Mobile.</li>
            </ul>
            <p>Este aplicativo foi desenvolvido para otimizar o controle e a gestão de processos empresariais, proporcionando uma solução móvel completa.</p>`,
    descriptionEn: `<p>Business control application developed with Kotlin and Java for Android, using SQL database.</p>
            <p>Resources include:</p>
            <ul>
                <li>Development of a business self-control application for Android.</li>
                <li>Implementation using Kotlin and Java with SQL database.</li>
                <li>Business data management and process control functionalities.</li>
                <li>Intuitive and efficient interface to facilitate daily operations.</li>
                <li>Skills: Kotlin, Android, Java, SQL, Git, Mobile Development.</li>
            </ul>
            <p>This application was developed to optimize the control and management of business processes, providing a complete mobile solution.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/AutoControlApp",
      },
    ],
  },
  "task-management": {
    titleKey: "project-task-management-title",
    image:
      '<img src="images/projects/task-management.jpg" alt="Sistema de Gerenciamento de Tarefas">',
    tags: ["Java", "Spring Boot", "MySQL", "HTML/CSS/JS", "CRUD"],
    descriptionPt: `<p>Sistema completo de gerenciamento de tarefas construído com Java (Spring Boot) e MySQL para backend, e HTML, CSS e JavaScript para o frontend.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Backend em Java com Spring Boot e banco de dados MySQL.</li>
                <li>Implementação de APIs RESTful para operações CRUD.</li>
                <li>Frontend desenvolvido com HTML, CSS e JavaScript.</li>
                <li>Funcionalidades: adição, edição, marcação de conclusão e exclusão de tarefas.</li>
                <li>Filtros por nome, data e status, além de notificações automáticas por e-mail.</li>
            </ul>
            <p>Este projeto foi desenvolvido como uma solução para gerenciar tarefas de forma eficiente, permitindo aos usuários organizar seu trabalho e aumentar sua produtividade.</p>`,
    descriptionEn: `<p>Complete task management system built with Java (Spring Boot) and MySQL for backend, and HTML, CSS and JavaScript for frontend.</p>
            <p>Resources include:</p>
            <ul>
                <li>Java backend with Spring Boot and MySQL database.</li>
                <li>Implementation of RESTful APIs for CRUD operations.</li>
                <li>Frontend developed with HTML, CSS and JavaScript.</li>
                <li>Features: adding, editing, completion marking and deletion of tasks.</li>
                <li>Filters by name, date and status, as well as automatic email notifications.</li>
            </ul>
            <p>This project was developed as a solution to efficiently manage tasks, allowing users to organize their work and increase productivity.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/TASK-MANAGEMENT-SYSTEM",
      },
    ],
  },
  "inventory-management": {
    titleKey: "project-inventory-management-title",
    image:
      '<img src="images/projects/inventory-management.jpg" alt="Sistema de Gerenciamento de Inventário">',
    tags: ["Node.js", "Express.js", "React.js", "MySQL", "bcrypt", "JWT"],
    descriptionPt: `<p>Sistema de gerenciamento de inventário desenvolvido usando Node.js (Express.js) e MySQL para backend, e React.js para frontend.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Desenvolvimento de um sistema de gerenciamento de estoque.</li>
                <li>Backend utilizando Node.js e Express.js, com banco de dados MySQL.</li>
                <li>Frontend em React.js com Axios para requisições HTTP.</li>
                <li>Autenticação segura com bcrypt (criptografia de senha) e JWT (gerenciamento de sessão).</li>
                <li>Funcionalidades CRUD para gerenciamento de usuários e materiais.</li>
            </ul>
            <p>Implementado para empresas que buscam otimizar o controle de estoque e melhorar a eficiência operacional.</p>`,
    descriptionEn: `<p>Inventory management system developed using Node.js (Express.js) and MySQL for backend, and React.js for frontend.</p>
            <p>Resources include:</p>
            <ul>
                <li>Development of a stock management system.</li>
                <li>Backend using Node.js and Express.js, with MySQL database.</li>
                <li>Frontend in React.js with Axios for HTTP requests.</li>
                <li>Secure authentication with bcrypt (password encryption) and JWT (session management).</li>
                <li>CRUD functionalities for user and material management.</li>
            </ul>
            <p>Implemented for companies looking to optimize inventory control and improve operational efficiency.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/API-ESTOQUES",
      },
    ],
  },
  "login-page": {
    titleKey: "project-login-page-title",
    image: '<img src="images/projects/login-page.jpg" alt="Página de Login">',
    tags: ["React.js", "Express.js", "SQLite", "JWT", "bcrypt"],
    descriptionPt: `<p>Página de login desenvolvida com React.js no frontend e Express.js com SQLite no backend.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Criação de uma página de login utilizando React.js no frontend.</li>
                <li>Backend desenvolvido com Express.js e SQLite.</li>
                <li>Autenticação segura com JWT e bcrypt para proteção de credenciais.</li>
                <li>Interface de usuário responsiva e intuitiva.</li>
                <li>Gestão eficiente de sessões de usuário.</li>
            </ul>
            <p>Ideal para projetos que necessitam de um sistema seguro e eficiente de login e gerenciamento de usuários.</p>`,
    descriptionEn: `<p>Login page developed with React.js on the frontend and Express.js with SQLite on the backend.</p>
            <p>Resources include:</p>
            <ul>
                <li>Creation of a login page using React.js on the frontend.</li>
                <li>Backend developed with Express.js and SQLite.</li>
                <li>Secure authentication with JWT and bcrypt for credential protection.</li>
                <li>Responsive and intuitive user interface.</li>
                <li>Efficient user session management.</li>
            </ul>
            <p>Ideal for projects that need a secure and efficient login and user management system.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/PAGINA-LOGIN",
      },
    ],
  },
  "platform-game": {
    titleKey: "project-platform-game-title",
    image:
      '<img src="images/projects/platform-game.jpg" alt="Projeto de Jogo de Plataforma">',
    tags: ["C++", "SFML", "OOP", "UML", "Game Development"],
    descriptionPt: `<p>Jogo de plataforma 2D desenvolvido em C++ utilizando a biblioteca SFML.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Desenvolvimento de um jogo de plataforma em C++.</li>
                <li>Utilização da biblioteca SFML para gráficos e física do jogo.</li>
                <li>Implementação de princípios de programação orientada a objetos.</li>
                <li>Design de níveis e mecânicas de jogo envolventes.</li>
                <li>Modelagem do projeto utilizando UML para organização do código.</li>
            </ul>
            <p>Este projeto demonstra conhecimentos avançados em C++, padrões de design, e desenvolvimento de jogos.</p>`,
    descriptionEn: `<p>2D platform game developed in C++ using the SFML library.</p>
            <p>Resources include:</p>
            <ul>
                <li>Development of a platform game in C++.</li>
                <li>Use of the SFML library for graphics and game physics.</li>
                <li>Implementation of object-oriented programming principles.</li>
                <li>Level design and engaging game mechanics.</li>
                <li>Project modeling using UML for code organization.</li>
            </ul>
            <p>This project demonstrates advanced knowledge in C++, design patterns, and game development.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/JOGO-PLATAFORMA",
      },
    ],
  },
  "timecard-app": {
    titleKey: "project-timecard-app-title",
    image:
      '<img src="images/projects/timecard-app.jpg" alt="App de Transcrição de Cartão de Ponto">',
    tags: ["Python", "PDF Processing", "CSV", "Data Extraction"],
    descriptionPt: `<p>Aplicativo Python que extrai dados de cartão de ponto em PDFs e converte para formato CSV.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Programa em Python para leitura de arquivos PDF e inserção de dados em uma planilha Excel.</li>
                <li>Automação do processamento de dados e exportação eficiente para Excel.</li>
                <li>Extração precisa de informações de horas trabalhadas a partir de documentos.</li>
                <li>Interface simples e eficiente para facilitar o uso.</li>
                <li>Otimização de processos de RH, reduzindo o tempo de processamento manual.</li>
            </ul>
            <p>Desenvolvido para otimizar processos de RH, reduzindo significativamente o tempo de processamento manual de cartões de ponto.</p>`,
    descriptionEn: `<p>Python application that extracts timecard data from PDFs and converts to CSV format.</p>
            <p>Resources include:</p>
            <ul>
                <li>Python program for reading PDF files and inserting data into an Excel spreadsheet.</li>
                <li>Automation of data processing and efficient export to Excel.</li>
                <li>Accurate extraction of working hours information from documents.</li>
                <li>Simple and efficient interface for ease of use.</li>
                <li>Optimization of HR processes, reducing manual processing time.</li>
            </ul>
            <p>Developed to optimize HR processes, significantly reducing the manual processing time of timecards.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/LEITOR-DE-CARTAO-PONTO",
      },
    ],
  },
  "dashboard-app": {
    titleKey: "project-dashboard-app-title",
    image:
      '<img src="images/projects/dashboard-app.jpg" alt="App de Dashboard">',
    tags: ["Python", "C++", "GUI", "Data Visualization"],
    descriptionPt: `<p>Aplicativo de monitoramento de métricas de sistema em tempo real com frontend Python e backend C++.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Desenvolvimento de um painel para monitoramento de métricas do sistema em tempo real.</li>
                <li>Interface gráfica desenvolvida em Python com backend em C++.</li>
                <li>Visualização de dados de desempenho do sistema em tempo real.</li>
                <li>Monitoramento de recursos como CPU, memória, disco e rede.</li>
                <li>Alertas configuráveis para situações críticas de desempenho.</li>
            </ul>
            <p>Criado para oferecer uma visão clara e objetiva do desempenho do sistema em tempo real.</p>`,
    descriptionEn: `<p>Real-time system metrics monitoring application with Python frontend and C++ backend.</p>
            <p>Resources include:</p>
            <ul>
                <li>Development of a dashboard for real-time system metrics monitoring.</li>
                <li>Graphical interface developed in Python with C++ backend.</li>
                <li>Real-time system performance data visualization.</li>
                <li>Monitoring of resources such as CPU, memory, disk and network.</li>
                <li>Configurable alerts for critical performance situations.</li>
            </ul>
            <p>Created to provide a clear and objective view of system performance in real time.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/python-dashboard",
      },
    ],
  },
  "voting-system": {
    titleKey: "project-voting-system-title",
    image:
      '<img src="images/projects/voting-system.jpg" alt="Sistema de Votação">',
    tags: ["Node.js", "Express.js", "React.js", "MySQL", "RESTful API"],
    descriptionPt: `<p>Sistema de votação online desenvolvido com Node.js (Express) e MySQL para backend, e React.js para frontend.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Desenvolvimento de uma página para enquetes com React.js no frontend.</li>
                <li>Backend construído com Express.js e MySQL.</li>
                <li>Autenticação de usuários e verificação de votos para evitar duplicidade.</li>
                <li>Dashboard para visualização de resultados em tempo real.</li>
                <li>API RESTful para integração com outros sistemas quando necessário.</li>
            </ul>
            <p>Implementado para facilitar processos democráticos em organizações, clubes e eventos.</p>`,
    descriptionEn: `<p>Online voting system developed with Node.js (Express) and MySQL for backend, and React.js for frontend.</p>
            <p>Resources include:</p>
            <ul>
                <li>Development of a poll page with React.js on the frontend.</li>
                <li>Backend built with Express.js and MySQL.</li>
                <li>User authentication and vote verification to avoid duplication.</li>
                <li>Dashboard for real-time results visualization.</li>
                <li>RESTful API for integration with other systems when needed.</li>
            </ul>
            <p>Implemented to facilitate democratic processes in organizations, clubs and events.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/danisommer/PAGINA-ENQUETE",
      },
    ],
  },
  "video-streaming": {
    titleKey: "project-video-streaming-title",
    image:
      '<img src="images/projects/video-streaming.jpg" alt="Site de Streaming de Vídeo">',
    tags: ["Java", "Spring Boot", "MongoDB", "React.js", "AWS S3"],
    descriptionPt: `<p>Plataforma de streaming de vídeo com backend Java (Spring Boot) e MongoDB, com frontend React.js.</p>
            <p>Recursos incluem:</p>
            <ul>
                <li>Participação no desenvolvimento do frontend de um clone funcional do YouTube.</li>
                <li>Frontend desenvolvido em React.js e backend em Java com MongoDB.</li>
                <li>Funcionalidades de upload, streaming e gerenciamento de vídeos.</li>
                <li>Sistema de usuários com perfis, inscrições e interações.</li>
                <li>Integração com serviços de armazenamento em nuvem para conteúdo de vídeo.</li>
            </ul>
            <p>Desenvolvido como um projeto colaborativo para criar uma alternativa de código aberto para plataformas de streaming de vídeo.</p>`,
    descriptionEn: `<p>Video streaming platform with Java backend (Spring Boot) and MongoDB, with React.js frontend.</p>
            <p>Resources include:</p>
            <ul>
                <li>Participation in the frontend development of a functional YouTube clone.</li>
                <li>Frontend developed in React.js and backend in Java with MongoDB.</li>
                <li>Video upload, streaming and management functionalities.</li>
                <li>User system with profiles, subscriptions and interactions.</li>
                <li>Integration with cloud storage services for video content.</li>
            </ul>
            <p>Developed as a collaborative project to create an open-source alternative to video streaming platforms.</p>`,
    links: [
      {
        icon: "fab fa-github",
        textKey: "project-github",
        url: "https://github.com/HunterNicky/TikTube",
      },
    ],
  },
};
// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Update theme toggle icon
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// Check for saved theme preference
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const icon = themeToggle.querySelector("i");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
});

// Mobile Navigation
mobileToggle.addEventListener("click", () => {
  mobileNav.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeNav.addEventListener("click", closeNavigation);
overlay.addEventListener("click", closeNavigation);

function closeNavigation() {
  mobileNav.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Scroll Events
window.addEventListener("scroll", () => {
  // Header shadow on scroll
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    backToTop.classList.add("active");
  } else {
    header.style.boxShadow = "none";
    backToTop.classList.remove("active");
  }

  // Activate nav links based on scroll position
  const scrollPosition = window.scrollY;

  document.querySelectorAll("section").forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

// Smooth Scrolling for Navigation Links with Improved Transition
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    const targetPosition = targetElement.offsetTop;

    // Close mobile navigation if open
    closeNavigation();

    // Scroll with better offset calculation and smoother animation
    window.scrollTo({
      top: targetPosition - 80,
      behavior: "smooth",
    });

    // Highlight the section being scrolled to
    setTimeout(() => {
      // Add a subtle highlight effect
      targetElement.classList.add("section-highlight");

      // Remove the highlight class after animation completes
      setTimeout(() => {
        targetElement.classList.remove("section-highlight");
      }, 1000);
    }, 500); // Timeout gives scrolling time to almost complete
  });
});

function setupSmoothScrolling(links) {
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only handle links that point to page sections
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();

        const targetId = href;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const targetPosition = targetElement.offsetTop;

          // Close mobile navigation if open
          closeNavigation();

          // Scroll with smooth behavior
          window.scrollTo({
            top: targetPosition - 80,
            behavior: "smooth",
          });

          // Highlight the section being scrolled to
          setTimeout(() => {
            targetElement.classList.add("section-highlight");

            setTimeout(() => {
              targetElement.classList.remove("section-highlight");
            }, 1000);
          }, 500);
        }
      }
    });
  });
}

// Apply smooth scrolling to all navigation elements
setupSmoothScrolling(navLinks);
setupSmoothScrolling(footerLinks);
setupSmoothScrolling(heroButtons);

// Back to Top
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Project Filtering
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      if (filter === "all") {
        card.style.display = "block";
      } else {
        const categories = card.dataset.category.split(" ");
        if (categories.includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      }
    });
  });
});

// Project Modal
projectLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const projectId = link.dataset.project;
    const project = projectsData[projectId];

    if (project) {
      // Populate modal content
      let modalContent = `
                <h2>${translations[currentLang][project.titleKey]}</h2>
                <div class="project-details-img">${project.image}</div>
                <div class="project-details-tags">
                    ${project.tags
                      .map((tag) => `<span class="project-tag">${tag}</span>`)
                      .join("")}
                </div>
                <div class="project-details-desc">
                    ${
                      currentLang === "en"
                        ? project.descriptionEn
                        : project.descriptionPt
                    }
                </div>
                <div class="project-details-links">
                    ${project.links
                      .map(
                        (link) => `
                        <a href="${link.url}" target="_blank" class="btn">
                            <i class="${link.icon}"></i>
                            <span>${
                              translations[currentLang][link.textKey]
                            }</span>
                        </a>
                    `
                      )
                      .join("")}
                </div>
            `;

      projectDetails.innerHTML = modalContent;
      projectModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });
});

// Close Modal
closeModal.addEventListener("click", () => {
  projectModal.classList.remove("active");
  document.body.style.overflow = "";
});

// Close modal when clicking outside
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

contactForm.addEventListener('submit', (e) => {
    // We don't prevent default, so form submits normally to Formspree
    // You can still add validation if needed
    
    // Store form submission status in sessionStorage for showing message after redirect
    sessionStorage.setItem('formSubmitted', 'true');
});

// Initialize AOS animation library if present
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 1000,
    once: true,
  });
}

const translations = {
  pt: {
    // Headers and nav
    "nav-home": "Home",
    "nav-about": "Sobre",
    "nav-skills": "Habilidades",
    "nav-experience": "Experiência",
    "nav-projects": "Projetos",
    "nav-contact": "Contato",

    // Hero section
    "hero-title": "Daniel Zaki Sommer",
    "hero-subtitle": "Backend Developer",
    "hero-text":
      "Estudante de Sistemas de Informação na UTFPR e Estagiário de Desenvolvimento Java na Meisters Solutions, especializado em desenvolvimento de sistemas E-Commerce utilizando Java (Spring), Docker, SQL e Hybris.",
    "hero-btn-projects": "Ver Projetos",
    "hero-btn-contact": "Contato",

    // About section
    "about-title": "Sobre Mim",
    "about-greeting": "Olá, sou o Daniel",
    "about-p1":
      "Sou estudante do 5º semestre de Sistemas de Informação na UTFPR e Estagiário de Desenvolvimento Java na Meisters Solutions. Tenho experiência no desenvolvimento de sistemas para E-Commerce, atuando no backend com Java (Spring), SQL, Docker e SAP Hybris e no frontend com TypeScript e Spartacus. Além disso, realizo integrações utilizando SAP Cloud Platform Integration (SCPI).",
    "about-p2":
      "Aprimorei minhas habilidades através de cursos sobre APIs REST, Docker, e adquiri experiência em trabalho em equipe e comunicação em ambientes colaborativos. Minha interação com clientes internacionais melhorou meu inglês, e construí projetos pessoais como sistema de gerenciamento de inventário, sistema de votação, site de streaming de vídeo e painel de monitoramento de sistema em tempo real.",
    "about-btn": "Ver CV",

    // Skills section
    "skills-title": "Minhas Habilidades",
    "skills-languages": "Linguagens e Frameworks",
    "skills-databases": "Bancos de Dados",
    "skills-languages-heading": "Idiomas",
    "skills-tools": "Outras Ferramentas",
    "skill-level-basic": "Básico",
    "skill-level-intermediate": "Intermediário",
    "skill-level-advanced": "Avançado",
    "skill-level-fluent": "Fluente",

    // Experience section
    "experience-title": "Experiência",
    "exp-job-title": "Java Development Intern",
    "exp-job-date": "Julho 2024 - Presente",
    "exp-job-company": "Meisters Solutions",
    "exp-job-li1":
      "Especializado em desenvolvimento de sistemas E-Commerce utilizando Java (Spring), Docker, SQL e SAP Hybris no backend, e TypeScript (Spartacus) no frontend.",
    "exp-job-li2":
      "Desenvolvimento de integrações com SCPI (SAP Cloud Platform Integration).",
    "exp-job-li3":
      "Aprimoramento de habilidades técnicas através de cursos sobre APIs REST, Git e Docker.",
    "exp-job-li4":
      "Experiência em trabalho em equipe, comunicação e colaboração com clientes internacionais, melhorando a proficiência em inglês.",
    "exp-edu-title": "Graduação em Sistemas de Informação",
    "exp-edu-date": "2023 - Presente",
    "exp-edu-school": "UTFPR - Universidade Tecnológica Federal do Paraná",
    "exp-edu-desc":
      "Atualmente no 5º semestre do curso de Sistemas de Informação.",
    "exp-courses-title": "Cursos Adicionais",
    "exp-courses-date": "2022 - 2024",

    // Projects section
    "projects-title": "Meus Projetos Pessoais",
    "projects-btn-all": "Todos",
    "project-details": "Detalhes",

    // Contact section
    "contact-title": "Entre em Contato",
    "contact-info": "Informações de Contato",
    "contact-form-name": "Nome",
    "contact-form-subject": "Assunto",
    "contact-form-message": "Mensagem",
    "contact-form-submit": "Enviar Mensagem",
    "contact-success":
      "Mensagem enviada com sucesso! Entrarei em contato em breve.",

    // Footer
    "footer-links": "Links Rápidos",
    "footer-social": "Redes Sociais",
    "footer-copyright":
      "© 2025 Daniel Zaki Sommer. Todos os direitos reservados.",
    "footer-description":
      "Backend Developer especializado em Java, Python e JavaScript com experiência em desenvolvimento de sistemas E-Commerce.",

    // Experience section - Timeline items
    "exp-job-title": "Java Development Intern",
    "exp-job-date": "Julho 2024 - Presente",
    "exp-job-company": "Meisters Solutions",
    "exp-job-li1":
      "Especializado em desenvolvimento de sistemas E-Commerce utilizando Java (Spring), Docker, SQL e SAP Hybris no backend, e TypeScript (Spartacus) no frontend.",
    "exp-job-li2":
      "Desenvolvimento de integrações com SCPI (SAP Cloud Platform Integration).",
    "exp-job-li3":
      "Aprimoramento de habilidades técnicas através de cursos sobre APIs REST, Git e Docker.",
    "exp-job-li4":
      "Experiência em trabalho em equipe, comunicação e colaboração com clientes internacionais, melhorando a proficiência em inglês.",

    "exp-edu-title": "Graduação em Sistemas de Informação",
    "exp-edu-date": "2023 - Presente",
    "exp-edu-school": "UTFPR - Universidade Tecnológica Federal do Paraná",
    "exp-edu-desc":
      "Atualmente no 5º semestre do curso de Sistemas de Informação.",

    "exp-courses-title": "Cursos Adicionais",
    "exp-courses-date": "2022 - 2024",

    // Project filter buttons
    "filter-all": "Todos",
    "filter-java": "Java",
    "filter-kotlin": "Kotlin",
    "filter-sql": "SQL",
    "filter-python": "Python",
    "filter-js": "JavaScript",
    "filter-cpp": "C/C++",

    // Project cards
    "project-auto-control-title": "Aplicativo de Autocontrole Empresarial",
    "project-auto-control-desc": "...",
    "project-details": "Detalhes",
    "project-github": "GitHub",

    "project-dashboard-title": "App de Dashboard",
    "project-dashboard-desc":
      "Monitoramento de métricas de sistema em tempo real com uma GUI Python e backend C++.",

    "project-platform-game-title": "Projeto de Jogo de Plataforma",
    "project-platform-game-desc":
      "Jogo de plataforma completo em C++ usando SFML, empregando Programação Orientada a Objetos e modelos UML.",

    "project-video-streaming-title": "Site de Streaming de Vídeo",
    "project-video-streaming-desc":
      "Contribuição para backend em Java (Spring Boot) com MongoDB, e frontend em React.js.",

    "project-task-management-title": "Sistema de Gerenciamento de Tarefas",
    "project-task-management-desc":
      "Sistema de gerenciamento de tarefas construído com Java (Spring Boot) e MySQL para backend, usando HTML, CSS e JavaScript para frontend.",

    "project-inventory-title": "Sistema de Gerenciamento de Inventário",
    "project-inventory-desc":
      "Desenvolvido usando Node.js (Express.js) e MySQL para backend, e React.js para frontend. Inclui autenticação com bcrypt e JWT.",

    "project-timecard-title": "App de Transcrição de Cartão de Ponto",
    "project-timecard-desc":
      "Desenvolvido em Python para converter dados de cartão de ponto de PDFs para CSV.",

    "project-login-title": "Página de Login",
    "project-login-desc":
      "Desenvolvida com React.js no frontend e Express.js com SQLite no backend. Inclui autenticação segura com bcrypt e JWT.",

    "project-voting-title": "Sistema de Votação",
    "project-voting-desc":
      "Criado com Node.js (Express.js) e MySQL para backend, e React.js para frontend. Inclui funcionalidades CRUD para enquetes.",

    "project-dashboard-app-title": "App de Dashboard",
    "project-timecard-app-title": "App de Transcrição de Cartão de Ponto",
    "project-auto-control-title": "Aplicativo de Autocontrole Empresarial",
    "project-inventory-management-title":
      "Sistema de Gerenciamento de Inventário",
    "project-login-page-title": "Página de Login",
    "project-voting-system-title": "Sistema de Votação",

    // Project modal content
    "modal-resources": "Recursos incluem:",
    "modal-features": "Características principais:",
    "modal-functionalities": "Funcionalidades:",
  },
  en: {
    // Headers and nav
    "nav-home": "Home",
    "nav-about": "About",
    "nav-skills": "Skills",
    "nav-experience": "Experience",
    "nav-projects": "Projects",
    "nav-contact": "Contact",

    // Hero section
    "hero-title": "Daniel Zaki Sommer",
    "hero-subtitle": "Backend Developer",
    "hero-text":
      "Information Systems student at UTFPR and Java Development Intern at Meisters Solutions, specialized in E-Commerce systems development using Java (Spring), Docker, SQL, and Hybris.",
    "hero-btn-projects": "View Projects",
    "hero-btn-contact": "Contact",

    // About section
    "about-title": "About Me",
    "about-greeting": "Hi, I am Daniel",
    "about-p1":
      "I am a 5th semester Information Systems student at UTFPR and Java Development Intern at Meisters Solutions. I have experience in developing E-Commerce systems, working with Java (Spring), SQL, Docker, and SAP Hybris on the backend, and TypeScript and Spartacus on the frontend. I also perform integrations using SAP Cloud Platform Integration (SCPI).",
    "about-p2":
      "I enhanced my skills through courses on REST APIs and Docker, and I gained experience in teamwork and communication in collaborative environments. My interaction with international clients improved my English, and I built personal projects such as inventory management system, voting system, video streaming website, and real-time system monitoring dashboard.",
    "about-btn": "See Resume",

    // Skills section
    "skills-title": "My Skills",
    "skills-languages": "Languages and Frameworks",
    "skills-databases": "Databases",
    "skills-languages-heading": "Languages",
    "skills-tools": "Other Tools",
    "skill-level-basic": "Basic",
    "skill-level-intermediate": "Intermediate",
    "skill-level-advanced": "Advanced",
    "skill-level-fluent": "Fluent",

    // Experience section
    "experience-title": "Experience",
    "exp-job-title": "Java Development Intern",
    "exp-job-date": "July 2024 - Present",
    "exp-job-company": "Meisters Solutions",
    "exp-job-li1":
      "Specialized in E-Commerce systems development using Java (Spring), Docker, SQL, and SAP Hybris on the backend, and TypeScript (Spartacus) on the frontend.",
    "exp-job-li2":
      "Development of integrations with SCPI (SAP Cloud Platform Integration).",
    "exp-job-li3":
      "Enhancement of technical skills through courses on REST APIs, Git, and Docker.",
    "exp-job-li4":
      "Experience in teamwork, communication, and collaboration with international clients, improving English proficiency.",
    "exp-edu-title": "Bachelor in Information Systems",
    "exp-edu-date": "2023 - Present",
    "exp-edu-school": "UTFPR - Federal University of Technology - Paraná",
    "exp-edu-desc":
      "Currently in the 5th semester of Information Systems program.",
    "exp-courses-title": "Additional Courses",
    "exp-courses-date": "2022 - 2024",

    // Projects section
    "projects-title": "My Personal Projects",
    "projects-btn-all": "All",
    "project-details": "Details",

    // Contact section
    "contact-title": "Get in Touch",
    "contact-info": "Contact Information",
    "contact-form-name": "Name",
    "contact-form-subject": "Subject",
    "contact-form-message": "Message",
    "contact-form-submit": "Send Message",
    "contact-success":
      "Message sent successfully! I will get back to you soon.",

    // Footer
    "footer-links": "Quick Links",
    "footer-social": "Social Media",
    "footer-copyright": "© 2025 Daniel Zaki Sommer. All rights reserved.",
    "footer-description":
      "Backend Developer specialized in Java, Python, and JavaScript with experience in E-Commerce systems development.",

    "exp-job-title": "Java Development Intern",
    "exp-job-date": "July 2024 - Present",
    "exp-job-company": "Meisters Solutions",
    "exp-job-li1":
      "Specialized in E-Commerce systems development using Java (Spring), Docker, SQL, and SAP Hybris on the backend, and TypeScript (Spartacus) on the frontend.",
    "exp-job-li2":
      "Development of integrations with SCPI (SAP Cloud Platform Integration).",
    "exp-job-li3":
      "Enhancement of technical skills through courses on REST APIs, Git, and Docker.",
    "exp-job-li4":
      "Experience in teamwork, communication, and collaboration with international clients, improving English proficiency.",

    "exp-edu-title": "Bachelor in Information Systems",
    "exp-edu-date": "2023 - Present",
    "exp-edu-school": "UTFPR - Federal University of Technology - Paraná",
    "exp-edu-desc":
      "Currently in the 5th semester of Information Systems program.",

    "exp-courses-title": "Additional Courses",
    "exp-courses-date": "2022 - 2024",

    // Project filter buttons
    "filter-all": "All",
    "filter-java": "Java",
    "filter-kotlin": "Kotlin",
    "filter-sql": "SQL",
    "filter-python": "Python",
    "filter-js": "JavaScript",
    "filter-cpp": "C/C++",

    // Project cards
    "project-auto-control-title": "Business Self-Control App",
    "project-auto-control-desc": "...",
    "project-details": "Details",
    "project-github": "GitHub",

    "project-dashboard-title": "Dashboard App",
    "project-dashboard-desc":
      "Real-time system metrics monitoring with a Python GUI and C++ backend.",

    "project-platform-game-title": "Platform Game Project",
    "project-platform-game-desc":
      "Complete platform game in C++ using SFML, employing Object-Oriented Programming and UML models.",

    "project-video-streaming-title": "Video Streaming Website",
    "project-video-streaming-desc":
      "Contribution to backend in Java (Spring Boot) with MongoDB, and frontend in React.js.",

    "project-task-management-title": "Task Management System",
    "project-task-management-desc":
      "Task management system built with Java (Spring Boot) and MySQL for backend, using HTML, CSS and JavaScript for frontend.",

    "project-inventory-title": "Inventory Management System",
    "project-inventory-desc":
      "Developed using Node.js (Express.js) and MySQL for backend, and React.js for frontend. Includes authentication with bcrypt and JWT.",

    "project-timecard-title": "Timecard Transcription App",
    "project-timecard-desc":
      "Developed in Python to convert timecard data from PDFs to CSV.",

    "project-login-title": "Login Page",
    "project-login-desc":
      "Developed with React.js on the frontend and Express.js with SQLite on the backend. Includes secure authentication with bcrypt and JWT.",

    "project-voting-title": "Voting System",
    "project-voting-desc":
      "Created with Node.js (Express.js) and MySQL for backend, and React.js for frontend. Includes CRUD functionalities for polls.",

    "project-dashboard-app-title": "Dashboard App",
    "project-timecard-app-title": "Timecard Transcription App",
    "project-auto-control-title": "Business Self-Control App",
    "project-inventory-management-title": "Inventory Management System",
    "project-login-page-title": "Login Page",
    "project-voting-system-title": "Voting System",

    // Project modal content
    "modal-resources": "Resources include:",
    "modal-features": "Key features:",
    "modal-functionalities": "Functionalities:",
  },
};

// Current language
let currentLang = localStorage.getItem("language") || "pt";

function updateLanguage(lang) {
  // Update current language
  currentLang = lang;
  localStorage.setItem("language", currentLang);

  // Update language toggle buttons
  document.querySelectorAll(".lang-option").forEach((option) => {
    option.classList.toggle("active", option.dataset.lang === currentLang);
  });

  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[currentLang] && translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  updateProjectCardTitles();

  // Check if projects modal is open and update its content if needed
  if (projectModal && projectModal.classList.contains("active")) {
    const projectId =
      document.querySelector(".project-details").dataset.project;
    if (projectId && projectsData[projectId]) {
      updateProjectModalContent(projectId);
    }
  }

  // Force redraw of the page to ensure changes are applied
  document.body.style.display = "none";
  setTimeout(() => {
    document.body.style.display = "";
  }, 10);

  // Update projects
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card, index) => {
    const project = projectsData[index];
    if (project && project.titleKey) {
      const titleElement = card.querySelector(".project-title");
      if (titleElement) {
        titleElement.textContent = translations[currentLang][project.titleKey];
      }
    }
  });

  // Update experience items
  const experienceItems = document.querySelectorAll(".timeline-item");
  experienceItems.forEach((item, index) => {
    const experience = experienceData[index];
    if (experience) {
      // Update role title
      const roleElement = item.querySelector(".timeline-title");
      if (roleElement && experience.roleKey) {
        roleElement.textContent = translations[currentLang][experience.roleKey];
      }

      // Update description
      const descElement = item.querySelector(".timeline-description");
      if (descElement) {
        descElement.innerHTML =
          currentLang === "en"
            ? experience.descriptionEn
            : experience.descriptionPt;
      }
    }
  });

  // If project modal is open, update its content
  const projectModal = document.querySelector(".project-modal");
  if (projectModal && projectModal.classList.contains("active")) {
    const projectDetailsElem = document.querySelector(".project-details");
    if (projectDetailsElem && projectDetailsElem.dataset.projectId) {
      const projectId = parseInt(projectDetailsElem.dataset.projectId);
      updateProjectModal(projectId);
    }
  }

  // Save language preference to localStorage
  localStorage.setItem("preferredLanguage", currentLang);
}

// Helper function to update modal content
function updateProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  const modalContent = document.querySelector(".project-details");
  if (!modalContent) return;

  // Update modal title
  const titleElement = modalContent.querySelector("h2");
  if (titleElement && project.titleKey) {
    titleElement.textContent = translations[currentLang][project.titleKey];
  }

  // Update description
  const descElement = modalContent.querySelector(".project-details-desc");
  if (descElement) {
    descElement.innerHTML =
      currentLang === "en" ? project.descriptionEn : project.descriptionPt;
  }

  // Update link texts
  const links = modalContent.querySelectorAll(".project-details-links .btn");
  project.links.forEach((link, i) => {
    if (links[i] && link.textKey) {
      const textSpan = links[i].querySelector("span");
      if (textSpan) {
        textSpan.textContent = translations[currentLang][link.textKey];
      }
    }
  });
}

// Initialize language from local storage
document.addEventListener("DOMContentLoaded", () => {
  // Add data-i18n attributes to elements
  addTranslationAttributes();
  initSkillsCarousel();
  // Initialize language
  updateLanguage(currentLang);

  // Set language option click handlers - Fixed implementation
  document.querySelectorAll(".language-option").forEach((option) => {
    option.addEventListener("click", function () {
      const lang =
        this.querySelector("span").textContent.trim() === "English"
          ? "en"
          : "pt";
      console.log("Changing language to:", lang); // Add debugging
      updateLanguage(lang);

      // Update UI to show active language
      document.querySelectorAll(".language-option").forEach((opt) => {
        opt.classList.toggle(
          "active",
          opt.querySelector("span").textContent.trim() ===
            (lang === "en" ? "English" : "Português")
        );
      });

      // Update language button text
      document.querySelector(".language-btn span").textContent =
        lang.toUpperCase();

      // Close dropdown if needed
      document.querySelector(".language-dropdown").style.display = "none";
      setTimeout(() => {
        document
          .querySelector(".language-dropdown")
          .style.removeProperty("display");
      }, 100);
    });
  });
});

// Function to add data-i18n attributes to elements
function addTranslationAttributes() {
  // Navigation
  document
    .querySelectorAll(".nav-links a")[0]
    .setAttribute("data-i18n", "nav-home");
  document
    .querySelectorAll(".nav-links a")[1]
    .setAttribute("data-i18n", "nav-about");
  document
    .querySelectorAll(".nav-links a")[2]
    .setAttribute("data-i18n", "nav-skills");
  document
    .querySelectorAll(".nav-links a")[3]
    .setAttribute("data-i18n", "nav-experience");
  document
    .querySelectorAll(".nav-links a")[4]
    .setAttribute("data-i18n", "nav-projects");
  document
    .querySelectorAll(".nav-links a")[5]
    .setAttribute("data-i18n", "nav-contact");

  // Mobile navigation
  document
    .querySelectorAll(".mobile-links a")[0]
    .setAttribute("data-i18n", "nav-home");
  document
    .querySelectorAll(".mobile-links a")[1]
    .setAttribute("data-i18n", "nav-about");
  document
    .querySelectorAll(".mobile-links a")[2]
    .setAttribute("data-i18n", "nav-skills");
  document
    .querySelectorAll(".mobile-links a")[3]
    .setAttribute("data-i18n", "nav-experience");
  document
    .querySelectorAll(".mobile-links a")[4]
    .setAttribute("data-i18n", "nav-projects");
  document
    .querySelectorAll(".mobile-links a")[5]
    .setAttribute("data-i18n", "nav-contact");

  // Hero section
  document
    .querySelector(".hero-subtitle")
    .setAttribute("data-i18n", "hero-subtitle");
  document.querySelector(".hero-text").setAttribute("data-i18n", "hero-text");
  document
    .querySelectorAll(".hero-btns a")[0]
    .setAttribute("data-i18n", "hero-btn-projects");
  document
    .querySelectorAll(".hero-btns a")[1]
    .setAttribute("data-i18n", "hero-btn-contact");

  // Section titles
  document
    .querySelectorAll(".section-title")[0]
    .setAttribute("data-i18n", "about-title");
  document
    .querySelectorAll(".section-title")[1]
    .setAttribute("data-i18n", "skills-title");
  document
    .querySelectorAll(".section-title")[2]
    .setAttribute("data-i18n", "experience-title");
  document
    .querySelectorAll(".section-title")[3]
    .setAttribute("data-i18n", "projects-title");
  document
    .querySelectorAll(".section-title")[4]
    .setAttribute("data-i18n", "contact-title");

  // About section
  document
    .querySelector(".about-content h2")
    .setAttribute("data-i18n", "about-greeting");
  document
    .querySelectorAll(".about-content p")[0]
    .setAttribute("data-i18n", "about-p1");
  document
    .querySelectorAll(".about-content p")[1]
    .setAttribute("data-i18n", "about-p2");
  document.querySelector(".about-btn").setAttribute("data-i18n", "about-btn");

  // Skills section
  document
    .querySelectorAll(".skill-category h3")[0]
    .setAttribute("data-i18n", "skills-languages");
  document
    .querySelectorAll(".skill-category h3")[1]
    .setAttribute("data-i18n", "skills-databases");
  document
    .querySelectorAll(".skill-category h3")[2]
    .setAttribute("data-i18n", "skills-languages-heading");
  document
    .querySelectorAll(".skill-category h3")[3]
    .setAttribute("data-i18n", "skills-tools");

  // Projects section
  document
    .querySelector(".filter-btn.active")
    .setAttribute("data-i18n", "projects-btn-all");

  // Contact section
  document
    .querySelector(".contact-info h3")
    .setAttribute("data-i18n", "contact-info");
  document
    .querySelector('label[for="name"]')
    .setAttribute("data-i18n", "contact-form-name");
  document
    .querySelector('label[for="subject"]')
    .setAttribute("data-i18n", "contact-form-subject");
  document
    .querySelector('label[for="message"]')
    .setAttribute("data-i18n", "contact-form-message");
  document
    .querySelector(".form-btn")
    .setAttribute("data-i18n", "contact-form-submit");

  // Footer
  document
    .querySelectorAll(".footer-col h3")[1]
    .setAttribute("data-i18n", "footer-links");
  document
    .querySelectorAll(".footer-col h3")[2]
    .setAttribute("data-i18n", "footer-social");
  document
    .querySelector(".copyright p")
    .setAttribute("data-i18n", "footer-copyright");

  // Footer links
  document
    .querySelectorAll(".footer-links a")[0]
    .setAttribute("data-i18n", "nav-home");
  document
    .querySelectorAll(".footer-links a")[1]
    .setAttribute("data-i18n", "nav-about");
  document
    .querySelectorAll(".footer-links a")[2]
    .setAttribute("data-i18n", "nav-skills");
  document
    .querySelectorAll(".footer-links a")[3]
    .setAttribute("data-i18n", "nav-experience");
  document
    .querySelectorAll(".footer-links a")[4]
    .setAttribute("data-i18n", "nav-projects");
  document
    .querySelectorAll(".footer-links a")[5]
    .setAttribute("data-i18n", "nav-contact");

  // Update skill levels
  document.querySelectorAll(".skill-level").forEach((level) => {
    if (level.textContent === "Básico") {
      level.setAttribute("data-i18n", "skill-level-basic");
    } else if (level.textContent === "Intermediário") {
      level.setAttribute("data-i18n", "skill-level-intermediate");
    } else if (level.textContent === "Avançado") {
      level.setAttribute("data-i18n", "skill-level-advanced");
    } else if (level.textContent === "Fluente") {
      level.setAttribute("data-i18n", "skill-level-fluent");
    }
  });

  // Experience timeline items
  const timelineItems = document.querySelectorAll(".timeline-item");
  // First timeline item (job)
  timelineItems[0]
    .querySelector("h3")
    .setAttribute("data-i18n", "exp-job-title");
  timelineItems[0]
    .querySelector(".timeline-date")
    .setAttribute("data-i18n", "exp-job-date");
  timelineItems[0]
    .querySelectorAll("p")[1]
    .setAttribute("data-i18n", "exp-job-company");
  const jobLiItems = timelineItems[0].querySelectorAll("li");
  jobLiItems[0].setAttribute("data-i18n", "exp-job-li1");
  jobLiItems[1].setAttribute("data-i18n", "exp-job-li2");
  jobLiItems[2].setAttribute("data-i18n", "exp-job-li3");
  jobLiItems[3].setAttribute("data-i18n", "exp-job-li4");

  // Second timeline item (education)
  timelineItems[1]
    .querySelector("h3")
    .setAttribute("data-i18n", "exp-edu-title");
  timelineItems[1]
    .querySelector(".timeline-date")
    .setAttribute("data-i18n", "exp-edu-date");
  timelineItems[1]
    .querySelectorAll("p")[1]
    .setAttribute("data-i18n", "exp-edu-school");
  timelineItems[1]
    .querySelector("li")
    .setAttribute("data-i18n", "exp-edu-desc");

  // Third timeline item (courses)
  timelineItems[2]
    .querySelector("h3")
    .setAttribute("data-i18n", "exp-courses-title");
  timelineItems[2]
    .querySelector(".timeline-date")
    .setAttribute("data-i18n", "exp-courses-date");

  // Project filter buttons
  document
    .querySelectorAll(".filter-btn")[0]
    .setAttribute("data-i18n", "filter-all");
  document
    .querySelectorAll(".filter-btn")[1]
    .setAttribute("data-i18n", "filter-java");
  document
    .querySelectorAll(".filter-btn")[2]
    .setAttribute("data-i18n", "filter-kotlin");
  document
    .querySelectorAll(".filter-btn")[3]
    .setAttribute("data-i18n", "filter-sql");
  document
    .querySelectorAll(".filter-btn")[4]
    .setAttribute("data-i18n", "filter-python");
  document
    .querySelectorAll(".filter-btn")[5]
    .setAttribute("data-i18n", "filter-js");
  document
    .querySelectorAll(".filter-btn")[6]
    .setAttribute("data-i18n", "filter-cpp");

  // Project cards - Add translation attributes to individual project cards
  const projectCards = document.querySelectorAll(".project-card");

  // Auto Control App
  projectCards[0].querySelector(".project-title").lastChild.textContent =
    " Aplicativo de Autocontrole Empresarial";
  projectCards[0]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-auto-control-title");
  projectCards[0]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-auto-control-desc");
  projectCards[0]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[0]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Dashboard App
  projectCards[1].querySelector(".project-title").lastChild.textContent =
    " App de Dashboard";
  projectCards[1]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-dashboard-title");
  projectCards[1]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-dashboard-desc");
  projectCards[1]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[1]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Platform Game
  projectCards[2].querySelector(".project-title").lastChild.textContent =
    " Projeto de Jogo de Plataforma";
  projectCards[2]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-platform-game-title");
  projectCards[2]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-platform-game-desc");
  projectCards[2]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[2]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Video Streaming
  projectCards[3].querySelector(".project-title").lastChild.textContent =
    " Site de Streaming de Vídeo";
  projectCards[3]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-video-streaming-title");
  projectCards[3]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-video-streaming-desc");
  projectCards[3]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[3]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Task Management
  projectCards[4].querySelector(".project-title").lastChild.textContent =
    " Sistema de Gerenciamento de Tarefas";
  projectCards[4]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-task-management-title");
  projectCards[4]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-task-management-desc");
  projectCards[4]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[4]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Inventory Management
  projectCards[5].querySelector(".project-title").lastChild.textContent =
    " Sistema de Gerenciamento de Inventário";
  projectCards[5]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-inventory-title");
  projectCards[5]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-inventory-desc");
  projectCards[5]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[5]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Timecard App
  projectCards[6].querySelector(".project-title").lastChild.textContent =
    " App de Transcrição de Cartão de Ponto";
  projectCards[6]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-timecard-title");
  projectCards[6]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-timecard-desc");
  projectCards[6]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[6]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Login Page
  projectCards[7].querySelector(".project-title").lastChild.textContent =
    " Página de Login";
  projectCards[7]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-login-title");
  projectCards[7]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-login-desc");
  projectCards[7]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[7]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");

  // Voting System
  projectCards[8].querySelector(".project-title").lastChild.textContent =
    " Sistema de Votação";
  projectCards[8]
    .querySelector(".project-title")
    .lastChild.setAttribute("data-i18n", "project-voting-title");
  projectCards[8]
    .querySelector(".project-desc")
    .setAttribute("data-i18n", "project-voting-desc");
  projectCards[8]
    .querySelectorAll(".project-link span")[0]
    .setAttribute("data-i18n", "project-details");
  projectCards[8]
    .querySelectorAll(".project-link span")[1]
    .setAttribute("data-i18n", "project-github");
}

// Function to update all project card titles when language changes
function updateProjectCardTitles() {
  // Map of project cards to their title keys
  const projectTitleMap = [
    { index: 0, key: "project-auto-control-title" },
    { index: 1, key: "project-dashboard-title" },
    { index: 2, key: "project-platform-game-title" },
    { index: 3, key: "project-video-streaming-title" },
    { index: 4, key: "project-task-management-title" },
    { index: 5, key: "project-inventory-title" },
    { index: 6, key: "project-timecard-title" },
    { index: 7, key: "project-login-title" },
    { index: 8, key: "project-voting-title" },
  ];

  const projectCards = document.querySelectorAll(".project-card");

  projectTitleMap.forEach((item) => {
    if (projectCards[item.index]) {
      const titleElement =
        projectCards[item.index].querySelector(".project-title");
      if (titleElement && translations[currentLang][item.key]) {
        // Preserve the icon
        const icon = titleElement.querySelector("i").outerHTML;
        titleElement.innerHTML =
          icon + " " + translations[currentLang][item.key];
      }
    }
  });
}

// Language dropdown toggle
const languageBtn = document.querySelector(".language-btn");
if (languageBtn) {
  languageBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const dropdown = document.querySelector(".language-dropdown");
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });
}

// Language option selection
document.querySelectorAll(".language-option").forEach((option) => {
  option.addEventListener("click", function () {
    const lang =
      this.querySelector("span").textContent.trim() === "English" ? "en" : "pt";
    console.log("Changing language to:", lang);

    // Update language
    currentLang = lang;
    localStorage.setItem("language", currentLang);

    // Update UI to show active language
    document.querySelector(".language-btn span").textContent =
      lang.toUpperCase();

    // Close dropdown
    document.querySelector(".language-dropdown").style.display = "none";

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (translations[currentLang] && translations[currentLang][key]) {
        element.textContent = translations[currentLang][key];
      }
    });

    // Update project details if modal is open
    if (projectModal.classList.contains("active")) {
      const projectId =
        document.querySelector(".project-details").dataset.project;
      if (projectId && projectsData[projectId]) {
        updateProjectModalContent(projectId);
      }
    }
  });
});

// Close dropdown when clicking elsewhere
document.addEventListener("click", function () {
  const dropdown = document.querySelector(".language-dropdown");
  if (dropdown && dropdown.style.display === "block") {
    dropdown.style.display = "none";
  }
});

// Skills Carousel
function initSkillsCarousel() {
  const carousel = document.querySelector(".skills-carousel");
  const skillCategories = document.querySelectorAll(".skill-category");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  if (!carousel || skillCategories.length === 0) return;

  let currentIndex = 0;

  // Create indicators
  skillCategories.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  // Set initial active state
  updateCarouselState();

  // Event listeners
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Swipe functionality for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarouselState();
    }
  }

  function nextSlide() {
    if (currentIndex < skillCategories.length - 1) {
      currentIndex++;
      updateCarouselState();
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarouselState();
  }

  function updateCarouselState() {
    // Update carousel position
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active class on slides
    skillCategories.forEach((category, index) => {
      category.classList.toggle("active", index === currentIndex);
    });

    // Update indicators
    const indicators = document.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });

    // Enable/disable buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === skillCategories.length - 1;
  }

  // Auto rotation (optional)
  let autoRotate = setInterval(() => {
    if (currentIndex < skillCategories.length - 1) {
      nextSlide();
    } else {
      currentIndex = 0;
      updateCarouselState();
    }
  }, 5000); // Change slide every 5 seconds

  // Stop auto rotation on hover/interaction
  carousel.addEventListener("mouseenter", () => clearInterval(autoRotate));
  prevBtn.addEventListener("mouseenter", () => clearInterval(autoRotate));
  nextBtn.addEventListener("mouseenter", () => clearInterval(autoRotate));
  indicatorsContainer.addEventListener("mouseenter", () =>
    clearInterval(autoRotate)
  );
}

// Initialize carousel on DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  initSkillsCarousel();
});
