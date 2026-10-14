import React from "react";
import {
  AiOutlineFastBackward,
  AiFillFastForward,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
} from "react-icons/ai";

const range = (start, end) => {
  return [...Array(end - start).keys()].map((el) => el + start);
};

const getPagesCut = ({ pagesCount, pagesCutCount, currentPage }) => {
  const ceiling = Math.ceil(pagesCutCount / 2);
  const floor = Math.floor(pagesCutCount / 2);

  if (pagesCount <= pagesCutCount) {
    return { start: 1, end: pagesCount + 1 };
  } else if (currentPage <= ceiling) {
    return { start: 1, end: pagesCutCount + 1 };
  } else if (currentPage + floor >= pagesCount) {
    return { start: pagesCount - pagesCutCount + 1, end: pagesCount + 1 };
  } else {
    return {
      start: currentPage - ceiling + 1,
      end: currentPage + floor + 1,
    };
  }
};

const PaginationItem = ({ page, currentPage, onPageChange, isDisabled }) => {
  if (isDisabled) return null;

  const isSelected = page === Number(currentPage);

  return (
    <button
      onClick={() => onPageChange(page)}
      className={`min-w-[40px] h-10 px-3.5 rounded-full text-xs font-black transition-all duration-300 flex items-center justify-center border font-mono ${
        isSelected
          ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.6)] scale-105"
          : "bg-[#0E131F] text-slate-300 border-white/10 hover:border-cyan-400/50 hover:text-cyan-300 backdrop-blur-md"
      }`}
    >
      {page}
    </button>
  );
};

const Pagination = ({ currentPage, total, limit, onPageChange, pagesNum }) => {
  const pagesCount = Math.ceil(total / limit);
  const pagesCut = getPagesCut({ pagesCount, pagesCutCount: 5, currentPage });
  const pages = range(pagesCut.start, pagesCut.end);

  const isFirstPage = Number(currentPage) === 1;
  const isLastPage = Number(currentPage) === pagesCount;

  if (pagesCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-12 mb-8">
      {!isFirstPage && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-full bg-[#0E131F] border border-white/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center transition-all shadow-md"
            aria-label="First page"
          >
            <AiOutlineFastBackward className="text-base" />
          </button>
          <button
            onClick={() => onPageChange(Number(currentPage) - 1)}
            className="w-10 h-10 rounded-full bg-[#0E131F] border border-white/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center transition-all shadow-md"
            aria-label="Previous page"
          >
            <AiOutlineArrowLeft className="text-base" />
          </button>
        </>
      )}

      {pages.map((page) => (
        <PaginationItem
          page={page}
          key={page}
          currentPage={Number(currentPage)}
          onPageChange={onPageChange}
        />
      ))}

      {!isLastPage && (
        <>
          <button
            onClick={() => onPageChange(Number(currentPage) + 1)}
            className="w-10 h-10 rounded-full bg-[#0E131F] border border-white/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center transition-all shadow-md"
            aria-label="Next page"
          >
            <AiOutlineArrowRight className="text-base" />
          </button>
          <button
            onClick={() => onPageChange(pagesNum || pagesCount)}
            className="w-10 h-10 rounded-full bg-[#0E131F] border border-white/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center transition-all shadow-md"
            aria-label="Last page"
          >
            <AiFillFastForward className="text-base" />
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
