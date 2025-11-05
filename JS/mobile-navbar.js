/**
 * Classe responsável por controlar o comportamento do menu mobile (hamburger)
 * e da navegação lateral na interface
 */
class MobileNavbar {
  /**
   * Inicializa a classe com os seletores necessários
   * @param {string} mobileMenu - Seletor do botão hamburger
   * @param {string} navList - Seletor da lista de navegação
   * @param {string} navLinks - Seletor dos links dentro da navegação
   */
  constructor(mobileMenu, navList, navLinks) {
    // Seleciona os elementos do DOM
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active"; // Classe CSS para controlar estado ativo

    // Garante que o 'this' mantenha o contexto correto quando o método for chamado
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Alterna as classes de ativo no menu e na lista de navegação
   * quando o botão hamburger é clicado
   */
  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    this.animateLinks();
  }

  /**
   * Adiciona o evento de clique no botão hamburger
   */
  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick);
  }

  /**
   * Inicializa o menu mobile se o botão hamburger existir no DOM
   * @returns {MobileNavbar} Retorna a instância para permitir encadeamento
   */
  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

// Cria uma nova instância do menu mobile com os seletores necessários
const mobileNavbar = new MobileNavbar(
  ".mobile-menu",    // Seletor do botão hamburger
  ".nav-list",       // Seletor da lista de navegação
  ".nav-list li",    // Seletor dos itens da navegação
);

// Inicializa o menu mobile
mobileNavbar.init();

