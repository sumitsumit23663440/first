const form = document.querySelector('#event-form');
const toast = document.querySelector('#toast');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  const originalLabel = submitButton.innerHTML;
  const formData = Object.fromEntries(new FormData(form));

  submitButton.disabled = true;
  submitButton.textContent = 'Saving...';

  try {
    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Unable to save your registration.');

    toast.textContent = 'Registration saved — see you at the board! ♟';
    toast.classList.add('visible');
    form.reset();
  } catch (error) {
    toast.textContent = error.message || 'Something went wrong. Please try again.';
    toast.classList.add('visible');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
    setTimeout(() => toast.classList.remove('visible'), 4200);
  }
});
