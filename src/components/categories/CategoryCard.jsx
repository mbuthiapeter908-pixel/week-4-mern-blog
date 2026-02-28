import { Link } from 'react-router-dom'

const colorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/50',
    gradient: 'from-blue-500 to-blue-600'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    hover: 'hover:bg-green-200 dark:hover:bg-green-900/50',
    gradient: 'from-green-500 to-green-600'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-800 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:bg-purple-200 dark:hover:bg-purple-900/50',
    gradient: 'from-purple-500 to-purple-600'
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-800 dark:text-pink-200',
    border: 'border-pink-200 dark:border-pink-800',
    hover: 'hover:bg-pink-200 dark:hover:bg-pink-900/50',
    gradient: 'from-pink-500 to-pink-600'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-200',
    border: 'border-yellow-200 dark:border-yellow-800',
    hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
    hover: 'hover:bg-orange-200 dark:hover:bg-orange-900/50',
    gradient: 'from-orange-500 to-orange-600'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
    hover: 'hover:bg-red-200 dark:hover:bg-red-900/50',
    gradient: 'from-red-500 to-red-600'
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-800 dark:text-indigo-200',
    border: 'border-indigo-200 dark:border-indigo-800',
    hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-900/50',
    gradient: 'from-indigo-500 to-indigo-600'
  }
}

const CategoryCard = ({ category, onClick, isSelected = false }) => {
  const colors = colorClasses[category.color] || colorClasses.blue

  return (
    <button
      onClick={() => onClick?.(category)}
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-300
        ${colors.bg} ${colors.border} ${colors.hover}
        ${isSelected ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 ' + colors.border : ''}
        group overflow-hidden
      `}
    >
      {/* Gradient Overlay on Hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-r ${colors.gradient} 
        opacity-0 group-hover:opacity-10 transition-opacity duration-300
      `} />

      {/* Content */}
      <div className="relative">
        <h3 className={`text-xl font-semibold mb-2 ${colors.text}`}>
          {category.name}
        </h3>
        
        {category.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${colors.text}`}>
            {category.postCount || 0} {category.postCount === 1 ? 'post' : 'posts'}
          </span>
          
          <span className={`
            inline-block px-3 py-1 text-xs font-semibold rounded-full
            ${colors.bg} ${colors.text}
          `}>
            Explore →
          </span>
        </div>
      </div>
    </button>
  )
}

export default CategoryCard