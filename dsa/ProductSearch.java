import java.util.*;

// ══════════════════════════════════════════════════════
//  LSMS E-Commerce — CO1: Product Search
//  Demonstrates: Linear Search + Binary Search
//  Real use: Search bar on the e-commerce platform
// ══════════════════════════════════════════════════════

class Product {
    int id;
    String name;
    double price;
    String category;

    Product(int id, String name, double price, String category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }

    public String toString() {
        return String.format("ID:%-4d | %-30s | $%-8.2f | %s", id, name, price, category);
    }
}

public class ProductSearch {

    // ── LINEAR SEARCH ─────────────────────────────────
    // Used when products are unsorted (e.g. new arrivals feed)
    // Time: O(n) | Space: O(1)
    static Product linearSearchByName(Product[] products, String query) {
        query = query.toLowerCase();
        for (Product p : products) {
            if (p.name.toLowerCase().contains(query)) {
                return p;
            }
        }
        return null;
    }

    // ── BINARY SEARCH ─────────────────────────────────
    // Used when products are sorted by ID (indexed catalog)
    // Time: O(log n) | Space: O(1)
    // Precondition: array must be sorted by product ID
    static Product binarySearchById(Product[] products, int targetId) {
        int low = 0, high = products.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (products[mid].id == targetId)
                return products[mid];
            else if (products[mid].id < targetId)
                low = mid + 1;
            else
                high = mid - 1;
        }
        return null;
    }

    // ── SORT BY ID (for Binary Search prerequisite) ───
    static void sortById(Product[] products) {
        // Bubble sort to sort by ID before binary search
        int n = products.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (products[j].id > products[j + 1].id) {
                    Product tmp = products[j];
                    products[j] = products[j + 1];
                    products[j + 1] = tmp;
                }
            }
        }
    }

    public static void main(String[] args) {
        // Simulate product catalog
        Product[] catalog = {
            new Product(5,  "Apple iPhone 15 Pro",       999.99, "Smartphones"),
            new Product(2,  "Samsung Galaxy S24",        849.99, "Smartphones"),
            new Product(8,  "Sony WH-1000XM5 Headphones",349.99, "Electronics"),
            new Product(1,  "Nike Air Max 270",           150.00, "Mens Shoes"),
            new Product(12, "Levi's 501 Original Jeans",  69.99, "Mens Clothing"),
            new Product(3,  "MacBook Pro M3",           1999.99, "Laptops"),
            new Product(7,  "Adidas Ultraboost 22",       180.00, "Mens Shoes"),
            new Product(10, "Zara Floral Dress",           59.99, "Womens Clothing"),
        };

        Scanner sc = new Scanner(System.in);
        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║     LSMS — Product Search Engine     ║");
        System.out.println("╚══════════════════════════════════════╝");
        System.out.println();

        // ── 1. LINEAR SEARCH by Name
        System.out.println("▶ LINEAR SEARCH (search by product name)");
        System.out.print("  Enter search query: ");
        String query = sc.nextLine();

        System.out.println("\n  Scanning catalog...");
        long start = System.nanoTime();
        Product found = linearSearchByName(catalog, query);
        long end = System.nanoTime();

        if (found != null) {
            System.out.println("  ✓ Found: " + found);
        } else {
            System.out.println("  ✗ No product matching \"" + query + "\"");
        }
        System.out.printf("  Time: O(n) — %d ns%n%n", (end - start));

        // ── 2. BINARY SEARCH by ID
        System.out.println("▶ BINARY SEARCH (search by product ID)");
        System.out.print("  Enter product ID: ");
        int id = sc.nextInt();

        // Sort first (binary search requires sorted array)
        sortById(catalog);
        System.out.println("\n  Catalog sorted by ID for binary search.");

        start = System.nanoTime();
        Product result = binarySearchById(catalog, id);
        end = System.nanoTime();

        if (result != null) {
            System.out.println("  ✓ Found: " + result);
        } else {
            System.out.println("  ✗ Product ID " + id + " not found.");
        }
        System.out.printf("  Time: O(log n) — %d ns%n", (end - start));

        sc.close();
    }
}
