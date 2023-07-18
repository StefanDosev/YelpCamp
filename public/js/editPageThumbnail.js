document.addEventListener('DOMContentLoaded', function() {
    const imageContainers = document.querySelectorAll('.image-container');

    imageContainers.forEach(function(container) {
      const checkbox = container.querySelector('.image-checkbox');

      container.addEventListener('click', function(event) {
        if (!event.target.closest('label')) {
          checkbox.checked = !checkbox.checked;
        }
        
        container.classList.toggle('selected');
      });
      
      checkbox.addEventListener('change', function(event) {
        container.classList.toggle('selected', this.checked);
      });
    });
  });