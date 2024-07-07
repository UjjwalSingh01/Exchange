

export default function Header(props: string) {
  return (
    <div className="flex justify-between p-4 border-b-[1px] border-gray-400">
        <div>
            <h1 className="text-2xl font-bold">Exchange</h1>
        </div>
        <div className="flex items-center">
            <h1 className="text-xl">Hello, {props.name}</h1>
            
        </div>
    </div>
  )
}

