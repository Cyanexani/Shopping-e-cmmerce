import java.util.*;

// ══════════════════════════════════════════════════════
//  LSMS E-Commerce — CO1: Product Sort
//  Demonstrates: Bubble Sort, Quick Sort, Merge Sort
//  Real use: "Sort by Price / Rating" feature on the site
// ══════════════════════════════════════════════════════

class ProductItem {
    String name;
    double price;
    double rating;

    ProductItem(String name, double price, double rating) {
        this.name   = name;
        this.price  = price;
        this.rating = rating;
    }

    public String toString() {
        return String.format("%-30s $%-8.2f ★ %.1f", name, price, rating);
    }
}

public class ProductSort {

    // ── BUBBLE SORT by Price (ascending) ──────────────
    // Simple, good for small lists (under 20 items)
    // Time: O(n²) | Space: O(1)
    static void bubbleSort(ProductItem[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j].price > arr[j + 1].price) {
                    ProductItem tmp = arr[j];
                    arr[j]     = arr[j + 1];
                    arr[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) break; // optimized: stop if already sorted
        }
    }

    // ── QUICK SORT by Price ────────────────────────────
    // Best for large catalogs (100+ products)
    // Time: O(n log n) avg | Space: O(log n)
    static void quickSort(ProductItem[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    static int partition(ProductItem[] arr, int low, int high) {
        double pivot = arr[high].price;
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j].price <= pivot) {
                i++;
                ProductItem tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
        }
        ProductItem tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
        return i + 1;
    }

    // ── MERGE SORT by Rating (descending) ─────────────
    // Most stable — used for "Top Rated" sort
    // Time: O(n log n) | Space: O(n)
    static void mergeSort(ProductItem[] arr, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    static void merge(ProductItem[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1, n2 = right - mid;
        ProductItem[] L = new ProductItem[n1], R = new ProductItem[n2];
        System.arraycopy(arr, left,    L, 0, n1);
        System.arraycopy(arr, mid + 1, R, 0, n2);
        int i = 0, j = 0, k = left;
        // Sort descending by rating (highest first)
        while (i < n1 && j < n2)
            arr[k++] = (L[i].rating >= R[j].rating) ? L[i++] : R[j++];
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    static void printProducts(ProductItem[] arr, String label) {
        System.out.println("\n  ── " + label + " ──");
        System.out.printf("  %-30s %-10s %s%n", "Product", "Price", "Rating");
        System.out.println("  " + "─".repeat(52));
        for (ProductItem p : arr) System.out.println("  " + p);
    }

    static ProductItem[] copy(ProductItem[] arr) {
        return Arrays.copyOf(arr, arr.length);
    }

    public static void main(String[] args) {
        ProductItem[] catalog = {
            new ProductItem("Apple iPhone 15 Pro",        999.99, 4.8),
            new ProductItem("Samsung Galaxy S24",         849.99, 4.6),
            new ProductItem("Nike Air Max 270",           150.00, 4.5),
            new ProductItem("MacBook Pro M3",            1999.99, 4.9),
            new ProductItem("Zara Floral Dress",           59.99, 4.2),
            new ProductItem("Adidas Ultraboost 22",       180.00, 4.7),
            new ProductItem("Sony WH-1000XM5",           349.99, 4.8),
            new ProductItem("Levi's 501 Original Jeans",  69.99, 4.3),
        };

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║     LSMS — Product Sort Engine       ║");
        System.out.println("╚══════════════════════════════════════╝");
        printProducts(catalog, "Original Order");

        // 1. Bubble Sort — Price Low to High
        ProductItem[] bubbled = copy(catalog);
        bubbleSort(bubbled);
        printProducts(bubbled, "Bubble Sort — Price: Low to High");

        // 2. Quick Sort — Price Low to High (faster)
        ProductItem[] quicked = copy(catalog);
        quickSort(quicked, 0, quicked.length - 1);
        printProducts(quicked, "Quick Sort — Price: Low to High");

        // 3. Merge Sort — Rating High to Low (Top Rated)
        ProductItem[] merged = copy(catalog);
        mergeSort(merged, 0, merged.length - 1);
        printProducts(merged, "Merge Sort — Rating: High to Low (Top Rated)");

        System.out.println("\n  Time Complexities:");
        System.out.println("  Bubble Sort : O(n²)      — best for small lists");
        System.out.println("  Quick Sort  : O(n log n) — best for large catalogs");
        System.out.println("  Merge Sort  : O(n log n) — stable, best for ratings");
    }
}
