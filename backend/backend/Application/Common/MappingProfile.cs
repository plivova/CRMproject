// // Created by Kateřina Plívová on 01.06.2025.

using AutoMapper;
using backend.Application.Advisors.Queries;
using backend.Application.Clients.Queries;
using backend.Application.Contracts.Queries;
using backend.Domain;

namespace backend.Application.Common;

public class MappingProfile: Profile
{
    public MappingProfile()
    {
        // Contracts
        CreateMap<Client, ContractClientDto>();
        CreateMap<Advisor, ContractAdvisorDto>();
        CreateMap<Contract, ContractDto>()
            .ForMember(dest => dest.Advisors, opt => opt.MapFrom(src => src.Advisors))
            .ForMember(dest => dest.Manager, opt => opt.MapFrom(src => src.Manager));
        
        // Client
        CreateMap<Client, ClientDto>();
        CreateMap<Contract, ClientContractDto>();
        
        // Advisor
        CreateMap<Advisor, AdvisorDto>()
            .ForMember(dest => dest.Contracts, opt => opt.MapFrom(src => src.Contracts));
        CreateMap<Contract, AdvisorContractDto>();
    }
}