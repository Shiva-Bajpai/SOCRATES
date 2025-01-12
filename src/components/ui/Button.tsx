type props = {
    children: string,
    type: string
}

export default function Button ({ children, type }: props) {
    return(
        <button className={`${(type == "light" ? "bg-primary" : "bg-secondary text-primary")} p-4 border-2 border-secondary rounded-full`}>
            {children}
        </button>
    )
}