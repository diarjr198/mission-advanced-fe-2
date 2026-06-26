export default function StarRating({ rating, className = "" }) {
    return (
        <div className={`flex items-center text-brand-secondary ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={
                        star <= Math.round(rating) ? "leading-none" : "leading-none text-gray-300"
                    }
                >
                    ★
                </span>
            ))}
        </div>
    );
}
