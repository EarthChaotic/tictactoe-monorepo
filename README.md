# วิธี Setup โปรแกรม

-Clone ตัวโปรเจคหรือ Download ไปลงในคอม

-ทำการติดตั้ง [Node.js](https://nodejs.org/en) ไว้ในเครื่อง(หากยังไม่เคยติดตั้ง)

## วิธี Run โปรแกรม

1.เปิดโฟลเดอร์โปรเจคด้วยตัวโปรแกรม Code Editor ที่มี Terminal (แนะนำโปรแกรม Visual Studio Code)

2.ทำการติดตั้ง dependency ต่างๆด้วยการพิมพ์ npm i ใน Terminal

3.รันโปรแกรมโดยการพิมพ์ npm run dev ใน Terminal

4.เปิดตัวเกมได้ที่หน้า http://localhost:3000/

## การออกแบบโปรแกรม

FrontEnd ใช้ React ในการออกแบบโดยเขียน Function ต่างๆด้วยภาษา TypeScript

Backend ใช้ JavaScript ในการเขียน API และใช้ MongoDB เป็นฐานข้อมูล

โดยทำการรันทั้งสองอย่างพร้อมกันโดยใช้ Turborepo เข้ามาช่วยในการจัดการ
