

function Button({text, onClick}) {
  return (
    <div>
        <button
        className="gradient-border px-7 py-2 xl:text-[35px] text-[14px] w-full text-center active:opacity-70 text-ellipsis"
        onClick={onClick}
        >
            {text || 'More Stories'}
        </button>
    </div>
  )
}

export default Button
