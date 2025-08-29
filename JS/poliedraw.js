document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.body.classList.toggle("sidebar-closed", sidebar.classList.contains("closed"));
    });

    document.querySelector('.estilo-btn').addEventListener('click', function() {
        document.querySelector('.sidebar-top-buttons').style.display = 'none';
    });
    document.querySelector('.detalhes-btn').addEventListener('click', function() {
        document.querySelector('.sidebar-top-buttons').style.display = 'none';
    });

    document.querySelector('.materias-btn').addEventListener('click', function() {
        document.querySelector('.sidebar-top-buttons').style.display = 'flex';
    });
});