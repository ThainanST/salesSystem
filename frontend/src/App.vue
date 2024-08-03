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
        const existingItem = order.items.find( (item: any) => item.idProduct === product.idProduct);
        if (!existingItem) {
            order.items.push({ idProduct: product.idProduct, price: product.price, quantity: 1 });
        } else {
            existingItem.quantity++;
        }
    }

    const getTotal = function () {
        let total = 0;
        for (const item of order.items) {
            total += item.price * item.quantity;
        }
        return total;
    }

    const getProductById = function (idProduct: number) {
        const product = products.find(product => product.idProduct === idProduct);
        return product;
    }

    const formatCurrency = function (value: number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

</script>

<template>
    <div class="title">Checkout</div>
    <div v-for="product in products">
        <span class="product-description">{{ product.description }}</span>
        <span class="product-price">{{ formatCurrency(product.price) }}</span>
        <button class="product-add-button" @click="addItem(product)">add</button>
    </div>
    <span class="total">{{ formatCurrency( getTotal() ) }}</span>
    <div v-for="item in order.items">
        <span class="item-description"> {{ getProductById(item.idProduct)?.description }}</span>
        <span class="item-quantity">{{ item.quantity }}</span>
    </div>
</template>

<style scoped>
</style>
