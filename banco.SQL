create database conectTI;
use conectTI;

create table chamados(
id int not null,
nome varchar(30) not null,
descricao text not null,
categoria varchar(20) not null,
prioridade varchar(100) not null,
status varchar(20) not null default 'aberto',
data_abertura datetime default current_timestamp,
primary key(id)
);