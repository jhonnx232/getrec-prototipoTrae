$(document).ready(function () {
  // Toggle password visibility
  $(".toggle-password").on("click", function () {
    const input = $(this).parent().find("input");
    const type = input.attr("type") === "password" ? "text" : "password";
    input.attr("type", type);
    $(this).toggleClass("fa-eye fa-eye-slash");
  });

  // Formulário de cadastro
  $("#cadastroForm").on("submit", function (e) {
    e.preventDefault();

    // Validar se as senhas coincidem
    const senha = $("#senha").val();
    const confirmarSenha = $("#confirmar-senha").val();

    if (senha !== confirmarSenha) {
      showMessage(
        "As senhas não coincidem. Por favor, verifique.",
        "error"
      );
      return;
    }

    // Coletar dados do formulário
    const formData = {
      nome: $("#nome").val(),
      sobrenome: $("#sobrenome").val(),
      email: $("#email").val(),
      senha: senha,
      tipo_usuario: $("#tipo-usuario").val(),
      empresa: $("#empresa").val(),
    };

    // Enviar para a API
    $.ajax({
      url: "/api/usuarios",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (response) {
        showMessage(
          "Cadastro realizado com sucesso! Redirecionando para o login...",
          "success"
        );
        // Redirecionar para a página de login após 2 segundos
        setTimeout(function () {
          window.location.href = "/app/login.html";
        }, 2000);
      },
      error: function (xhr) {
        let errorMsg = "Erro ao realizar cadastro.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMsg = xhr.responseJSON.error;
        }
        showMessage(errorMsg, "error");
      },
    });
  });

  // Função para exibir mensagens
  function showMessage(message, type) {
    const messageElement = $("#mensagem-cadastro");
    messageElement.text(message);
    messageElement.css("color", type === "success" ? "green" : "red");
    messageElement.show();
  }
});