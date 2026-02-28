import { Link } from 'react-router-dom'

const colorMap = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
}

const CategoryBadge = ({ category, size = 'md', linkable = true }) => {
  const baseClasses = colorMap[category.color] || colorMap.blue
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const badge = (
    <span className={`
      inline-block font-semibold rounded-full
      ${baseClasses}
      ${sizeClasses[size]}
    `}>
      {category.name}
    </span>
  )

  if (linkable) {
    return (
      <Link to={`/categories/${category.slug}`} className="hover:opacity-80 transition-opacity">
        {badge}
      </Link>
    )
  }

  return badge
}

export default CategoryBadge