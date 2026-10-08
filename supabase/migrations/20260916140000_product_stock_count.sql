-- Product inventory (units available). NULL = stock not tracked (unlimited).
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock_count INTEGER;

COMMENT ON COLUMN public.products.stock_count IS
  'Units in stock. NULL means inventory is not enforced.';

CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_product_id TEXT, p_quantity INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining INTEGER;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RAISE EXCEPTION 'Quantity must be at least 1';
  END IF;

  UPDATE public.products
  SET stock_count = stock_count - p_quantity
  WHERE id = p_product_id
    AND stock_count IS NOT NULL
    AND stock_count >= p_quantity
  RETURNING stock_count INTO remaining;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN remaining;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_product_stock(TEXT, INTEGER) TO service_role;
