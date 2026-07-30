import smtplib

EMAIL = "connect.query.official@gmail.com"
PASSWORD = "uszluyibxycknunm"

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()

server.login(EMAIL, PASSWORD)

print("LOGIN SUCCESS!")

server.quit()