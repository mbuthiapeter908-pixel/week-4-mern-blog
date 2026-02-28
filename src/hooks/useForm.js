import { useState } from 'react'

export const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({
      ...touched,
      [name]: true
    })

    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)
    }
  }

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    })
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  const isValid = () => {
    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)
      return Object.keys(validationErrors).length === 0
    }
    return true
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    isValid
  }
}