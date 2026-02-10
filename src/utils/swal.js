import Swal from 'sweetalert2'

// Custom SweetAlert2 configuration for MealMatch
const defaultConfig = {
  confirmButtonColor: '#FF6B35',
  cancelButtonColor: '#6c757d',
  customClass: {
    popup: 'meal-match-popup',
    title: 'meal-match-title',
    confirmButton: 'meal-match-btn',
    cancelButton: 'meal-match-btn'
  }
}

export const showSuccess = (title, text, timer = 3000) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text,
    timer,
    showConfirmButton: true
  })
}

export const showError = (title, text) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text
  })
}

export const showWarning = (title, text) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text
  })
}

export const showConfirm = (title, text, confirmText = 'Yes', cancelText = 'Cancel') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#f44336'
  })
}

export const showInfo = (title, text) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text
  })
}

export default Swal
