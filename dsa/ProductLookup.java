import java.util.*;

// ══════════════════════════════════════════════════════
//  LSMS E-Commerce — CO4: Product Lookup (Hashing)
//  Demonstrates: Division, Mid-Square, Folding,
//                Multiplication, Separate Chaining,
//                Linear Probing, Quadratic, Double Hash
//  Real use: Instant product lookup by ID in catalog
// ══════════════════════════════════════════════════════

// ── Product Record ─────────────────────────────────────
class ProductRecord {
    int id;
    String name;
    double price;

    ProductRecord(int id, String name, double price) {
        this.id = id; this.name = name; this.price = price;
    }

    public String toString() {
        return String.format("ID:%-5d %-30s $%.2f", id, name, price);
    }
}

// ── 1. SEPARATE CHAINING Hash Table ────────────────────
class ChainNode { ProductRecord rec; ChainNode next; ChainNode(ProductRecord r) { rec=r; next=null; } }

class ChainingTable {
    private ChainNode[] table;
    private int m;

    ChainingTable(int m) { this.m = m; table = new ChainNode[m]; }

    private int hash(int key) { int h = key % m; return h < 0 ? h + m : h; }

    void insert(ProductRecord rec) {
        int idx = hash(rec.id);
        ChainNode node = new ChainNode(rec);
        node.next = table[idx]; table[idx] = node;
    }

    ProductRecord search(int id) {
        int idx = hash(id); ChainNode cur = table[idx];
        while (cur != null) { if (cur.rec.id == id) return cur.rec; cur = cur.next; }
        return null;
    }

    void display() {
        System.out.println("\n  ── Separate Chaining Hash Table (m=" + m + ") ──");
        for (int i = 0; i < m; i++) {
            System.out.print("  [" + i + "] ");
            ChainNode cur = table[i];
            if (cur == null) { System.out.println("—"); continue; }
            while (cur != null) { System.out.print("ID:" + cur.rec.id + "(" + cur.rec.name.split(" ")[0] + ") "); cur = cur.next; }
            System.out.println();
        }
    }
}

// ── 2. LINEAR PROBING Hash Table ───────────────────────
class LinearProbingTable {
    private ProductRecord[] table;
    private boolean[] deleted;
    private int m, n;

    LinearProbingTable(int m) { this.m = m; table = new ProductRecord[m]; deleted = new boolean[m]; }

    private int hash(int key) { int h = key % m; return h < 0 ? h + m : h; }

    void insert(ProductRecord rec) {
        int j = hash(rec.id);
        for (int i = 0; i < m; i++) {
            int p = (j + i) % m;
            if (table[p] == null || deleted[p]) { table[p] = rec; deleted[p] = false; n++; return; }
            if (table[p].id == rec.id) { System.out.println("  Already exists: " + rec.id); return; }
        }
        System.out.println("  Table full!");
    }

    ProductRecord search(int id) {
        int j = hash(id);
        for (int i = 0; i < m; i++) {
            int p = (j + i) % m;
            if (table[p] == null && !deleted[p]) return null;
            if (table[p] != null && !deleted[p] && table[p].id == id) return table[p];
        }
        return null;
    }

    void display() {
        System.out.println("\n  ── Linear Probing Hash Table (m=" + m + ") ──");
        for (int i = 0; i < m; i++) {
            if (table[i] == null) System.out.printf("  [%2d] EMPTY%n", i);
            else if (deleted[i])  System.out.printf("  [%2d] DELETED%n", i);
            else System.out.printf("  [%2d] ID:%-5d %s%n", i, table[i].id, table[i].name);
        }
        System.out.printf("  Load factor: %.2f%n", (double) n / m);
    }
}

// ── 3. DOUBLE HASHING Table ────────────────────────────
class DoubleHashTable {
    private ProductRecord[] table;
    private boolean[] deleted;
    private int m, R, n;

    DoubleHashTable(int m, int R) { this.m=m; this.R=R; table=new ProductRecord[m]; deleted=new boolean[m]; }

    private int h1(int k) { int h = k % m; return h < 0 ? h + m : h; }
    private int h2(int k) { int r = k % R; if (r < 0) r += R; int s = R - r; return s == 0 ? 1 : s; }

    void insert(ProductRecord rec) {
        int j = h1(rec.id), step = h2(rec.id);
        for (int i = 0; i < m; i++) {
            int p = (j + i * step) % m;
            if (table[p] == null || deleted[p]) { table[p] = rec; deleted[p] = false; n++; return; }
        }
        System.out.println("  Table full!");
    }

    ProductRecord search(int id) {
        int j = h1(id), step = h2(id);
        for (int i = 0; i < m; i++) {
            int p = (j + i * step) % m;
            if (table[p] == null && !deleted[p]) return null;
            if (table[p] != null && !deleted[p] && table[p].id == id) return table[p];
        }
        return null;
    }

    void display() {
        System.out.println("\n  ── Double Hashing Table (m=" + m + ", R=" + R + ") ──");
        for (int i = 0; i < m; i++) {
            if (table[i] == null) System.out.printf("  [%2d] EMPTY%n", i);
            else System.out.printf("  [%2d] ID:%-5d %s%n", i, table[i].id, table[i].name);
        }
        System.out.printf("  Load factor: %.2f%n", (double) n / m);
    }
}

public class ProductLookup {
    // Hash function demos
    static int divisionHash(int key, int m)      { return Math.abs(key % m); }
    static int midSquareHash(int key, int m) {
        long sq = (long) key * key;
        String s = Long.toString(sq);
        while (s.length() < 4) s = "0" + s;
        int mid = Integer.parseInt(s.substring(s.length()/2 - 1, s.length()/2 + 1));
        return mid % m;
    }
    static int multiplicationHash(int key, int m) {
        double A = 0.6180339887;
        return (int) Math.floor(m * ((key * A) % 1));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        ProductRecord[] products = {
            new ProductRecord(101, "Apple iPhone 15 Pro",       999.99),
            new ProductRecord(205, "Samsung Galaxy S24",        849.99),
            new ProductRecord(312, "MacBook Pro M3",           1999.99),
            new ProductRecord(407, "Nike Air Max 270",          150.00),
            new ProductRecord(518, "Sony WH-1000XM5",           349.99),
            new ProductRecord(623, "Zara Floral Dress",          59.99),
            new ProductRecord(734, "Levi's 501 Jeans",           69.99),
            new ProductRecord(845, "Adidas Ultraboost 22",      180.00),
        };

        int m = 11, R = 7;
        ChainingTable    chainTable  = new ChainingTable(m);
        LinearProbingTable lpTable   = new LinearProbingTable(m);
        DoubleHashTable    dhTable   = new DoubleHashTable(m, R);

        for (ProductRecord p : products) {
            chainTable.insert(p);
            lpTable.insert(p);
            dhTable.insert(p);
        }

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║   LSMS — Product Lookup (Hashing)    ║");
        System.out.println("╚══════════════════════════════════════╝");

        // Show hash function comparison
        System.out.println("\n  ── Hash Function Comparison (m=" + m + ") ──");
        System.out.printf("  %-10s %-15s %-15s %-15s%n", "ProductID", "Division", "Mid-Square", "Multiplication");
        System.out.println("  " + "─".repeat(58));
        for (ProductRecord p : products) {
            System.out.printf("  %-10d %-15d %-15d %-15d%n",
                p.id,
                divisionHash(p.id, m),
                midSquareHash(p.id, m),
                multiplicationHash(p.id, m));
        }

        while (true) {
            System.out.println("\n  ==== LOOKUP MENU ====");
            System.out.println("  1. Search (Separate Chaining)");
            System.out.println("  2. Search (Linear Probing)");
            System.out.println("  3. Search (Double Hashing)");
            System.out.println("  4. Display Chaining Table");
            System.out.println("  5. Display Linear Probing Table");
            System.out.println("  6. Display Double Hashing Table");
            System.out.println("  0. Exit");
            System.out.print("  Choice: ");
            int ch = sc.nextInt();

            if (ch == 0) { sc.close(); return; }

            if (ch >= 1 && ch <= 3) {
                System.out.print("  Enter Product ID to search: ");
                int id = sc.nextInt();
                ProductRecord found = null;
                if      (ch == 1) found = chainTable.search(id);
                else if (ch == 2) found = lpTable.search(id);
                else              found = dhTable.search(id);
                if (found != null) System.out.println("  ✓ Found: " + found);
                else System.out.println("  ✗ Product ID " + id + " not found.");
            } else if (ch == 4) chainTable.display();
            else if (ch == 5) lpTable.display();
            else if (ch == 6) dhTable.display();
            else System.out.println("  Invalid choice.");
        }
    }
}
