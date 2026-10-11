// Product model: id stays fixed; the other fields can change.
class Product(
    val id: Int,
    var name: String,
    var price: Double,
    var category: String,
    var stock: Int? = null
)

// A nullable stock means that its value is unknown.
fun stockLabel(stock: Int?): String {
    if (stock == null) {
        return "Sin dato"
    }

    return when {
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    return price * (1.0 - percent / 100.0)
}

fun main() {
    val firstProduct = Product(
        id = 1,
        name = "Agua mineral",
        price = 1800.0,
        category = "Bebidas",
        stock = null
    )

    val secondProduct = Product(
        id = 2,
        name = "Galletas de avena",
        price = 2700.0,
        category = "Snacks",
        stock = 0
    )

    val thirdProduct = Product(
        id = 3,
        name = "Jabón de manos",
        price = 6900.0,
        category = "Aseo",
        stock = 3
    )

    println(
        "${firstProduct.name} | ${stockLabel(firstProduct.stock)} | " +
        "Precio con 10% de descuento: ${applyDiscount(firstProduct.price, 10)}"
    )

    println(
        "${secondProduct.name} | ${stockLabel(secondProduct.stock)} | " +
        "Precio con 10% de descuento: ${applyDiscount(secondProduct.price, 10)}"
    )

    println(
        "${thirdProduct.name} | ${stockLabel(thirdProduct.stock)} | " +
        "Precio con 10% de descuento: ${applyDiscount(thirdProduct.price, 10)}"
    )
}