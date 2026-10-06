const dialog = document.querySelector('#enroll-dialog');
let trigger;
document.querySelectorAll('[data-enroll]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    trigger = link;
    dialog.showModal();
  });
});
document.querySelectorAll('.close, .confirm').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => trigger?.focus());
document.querySelector('#year').textContent = new Date().getFullYear();
