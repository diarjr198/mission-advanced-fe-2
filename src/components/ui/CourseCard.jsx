import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

export default function CourseCard({ course }) {
    const navigate = useNavigate();
    const {
        id,
        title,
        description,
        image,
        instructor,
        role,
        company,
        avatar,
        rating,
        reviews,
        price,
    } = course;

    return (
        <article
            onClick={() => navigate(`/course/${id}`)}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft sm:p-5"
        >
            <div className="flex flex-wrap gap-3 sm:block">
                <img
                    className="h-[82px] w-[82px] rounded-xl object-cover sm:mb-4 sm:h-[193px] sm:w-full"
                    src={image}
                    alt={title}
                    loading="lazy"
                />

                <div className="min-w-0 flex flex-1 flex-col justify-between sm:space-y-2">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-lg">
                        {title}
                    </h3>
                    <div className="hidden sm:block">
                        <p
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                            className="text-sm font-medium leading-relaxed text-slate-500"
                        >
                            {description}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 overflow-hidden rounded-[10px] sm:h-10 sm:w-10">
                            <img
                                className="h-full w-full object-cover"
                                src={avatar}
                                alt={instructor}
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium">{instructor}</p>
                            <p className="text-xs text-slate-500 sm:text-sm">
                                {role}{" "}
                                <span className="hidden sm:inline">
                                    di{" "}
                                    <strong className="text-brand-dark">
                                        {company}
                                    </strong>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-center justify-between sm:mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                        <StarRating rating={rating} />
                        <span className="underline underline-offset-2">
                            {rating} ({reviews})
                        </span>
                    </div>
                    <span className="text-base font-semibold text-brand-primary sm:text-2xl">
                        {price}
                    </span>
                </div>
            </div>
        </article>
    );
}
