public class JavaTestFile {
    public static void main(String[] args) {
        int x = 5;
        int y = 10;

        // Eine verschachtelte if-else-Bedingung
        if (x > y) {
            System.out.println("x ist größer als y");
        } else {
            System.out.println("x ist nicht größer als y");
            
            // Eine innere if-else-Bedingung
            if (x == y) {
                System.out.println("x ist gleich y");
            } else {
                System.out.println("x ist nicht gleich y");
            }
        }

        // Eine while-Schleife
        while (x < 10) {
            System.out.println("x ist kleiner als 10");
            x++;
            
            // Eine innere while-Schleife
            int i = 0;
            while (i < 3) {
                System.out.println("Innere Schleife: i = " + i);
                i++;
            }
        }
    }
}
