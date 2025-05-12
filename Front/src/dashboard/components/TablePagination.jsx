import { Pagination } from "@nextui-org/react"

export const TablePagination = ({ page, pages, onPageChange }) => {
  return (
    <div className="flex w-full justify-center">
      <Pagination
        isCompact
        showControls
        color="primary"
        page={page}
        total={pages}
        onChange={(page) => onPageChange(page)}
      />
    </div>)
}