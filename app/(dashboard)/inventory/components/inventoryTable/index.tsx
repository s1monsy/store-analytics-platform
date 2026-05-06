import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Pencil, Trash2, PackageOpen, Plus, Minus } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import type { InventoryItem } from "@/shared/lib/store";

interface InventoryTableProps {
  paginated: InventoryItem[];
  filtered: InventoryItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onAdjustQty: (id: string, delta: number) => void;
  onAddClick: () => void;
}

export function InventoryTable({
  paginated,
  filtered,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onAdjustQty,
  onAddClick,
}: InventoryTableProps) {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Немає товарів на складі</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={onAddClick}>
                Додати запис
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Товар</TableHead>
                  <TableHead className="text-xs">Артикул</TableHead>
                  <TableHead className="text-center text-xs">Кількість</TableHead>
                  <TableHead className="text-center text-xs">Мін. поріг</TableHead>
                  <TableHead className="text-xs">Статус</TableHead>
                  <TableHead className="hidden text-xs md:table-cell">Оновлено</TableHead>
                  <TableHead className="w-36 text-xs">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => {
                  const isLow = item.qty < item.minQty;
                  return (
                    <TableRow key={item.id} className={cn(isLow && "bg-destructive/5")}>
                      <TableCell className="text-sm font-medium">{item.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.sku || "—"}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">{item.qty}</TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {item.minQty}
                      </TableCell>
                      <TableCell>
                        {isLow ? (
                          <Badge variant="destructive" className="text-xs font-normal">
                            Мало
                          </Badge>
                        ) : (
                          <Badge className="text-xs font-normal bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                            Норма
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {item.updatedAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onAdjustQty(item.id, -1)}
                            disabled={item.qty <= 0}
                            aria-label="Зменшити"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onAdjustQty(item.id, 1)}
                            aria-label="Збільшити"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onEdit(item)}
                            aria-label="Редагувати"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => onDelete(item.id)}
                            aria-label="Видалити"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <span className="shrink-0 w-1/3">
            {filtered.length} товарів, сторінка {page} з {totalPages}
          </span>
          <Pagination className="mx-0 w-1/3">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => onPageChange(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
