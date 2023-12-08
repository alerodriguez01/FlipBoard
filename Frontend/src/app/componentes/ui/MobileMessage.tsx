import Image from "next/image"

const MobileMessage = () => {
    return (
        <div className="md:hidden flex flex-col items-center justify-center bg-white text-black gap-3 min-h-[100dvh] p-3">
            <Image src="/flipboard-icon.png" alt="FlipBoard" width={100} height={100} />
            <p className="text-center">¡FlipBoard estará disponible para móviles pronto!</p>
        </div>
    )
}

export default MobileMessage