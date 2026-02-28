const Container = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto px-8 py-8 ${className}`}>
      {children}
    </div>
  )
}

export default Container