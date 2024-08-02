<script setup lang="ts">
import { reactive } from 'vue';

    const products = reactive([
        { idProduct: 1, description: 'A', price: 1000 },
        { idProduct: 2, description: 'B', price: 5000 },
        { idProduct: 3, description: 'C', price: 30 },
    ]);

    const order = reactive({
        total: 0,
        items: [] as any,
    })

    const addItem = function (product: any) {
        order.items.push({
            idProduct: product.idProduct,
            price: product.price,
            quantity: 1,
        });
    }

    const getTotal = function () {
        let total = 0;
        for (const item of order.items) {
            total += item.price
        }
        return total;
    }

</script>

<template>
    <div class="title">Checkout</div>
    <div v-for="product in products">
        <span class="product-description">{{ product.description }}</span>
        <span class="product-price">{{ product.price }}</span>
        <button class="product-add-button" @click="addItem(product)">add</button>
    </div>
    <span class="total">{{ getTotal() }}</span>
</template>

<style scoped>
</style>
