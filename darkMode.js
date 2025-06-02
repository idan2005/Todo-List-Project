document.getElementById('toggleDarkMode').onclick = function() {
    document.body.classList.toggle('dark-mode');
    updateDeleteIcons();
};

function updateDeleteIcons() {
    const isDark = document.body.classList.contains('dark-mode');
    document.querySelectorAll('.delete_icon').forEach(img => {
        img.src = isDark ? 'icons/blackGarbage.png' : 'icons/garbage.png';
    });
}
