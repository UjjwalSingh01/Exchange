
interface AmountProps {
  heading: string, 
  amount: number
}

const AmountCard = (props: AmountProps) => {
  return (
    
    <div className='flex justify-center text-center' >
      <div className="block w-1/2 p-6 bg-white border border-gray-200 rounded-lg drop-shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h1 className="text-2xl">{props.heading} : ${props.amount}</h1>
      </div>
    </div>
  )
}

export default AmountCard